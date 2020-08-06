import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Logger, ValidationPipe} from "@nestjs/common";
import {Connection} from "typeorm";
import express = require('express');
import http = require('http');
import io = require('socket.io');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false
    });

    const logger = new Logger();
    app.useLogger(logger);

    /* OpenAPI specification */
    const options = new DocumentBuilder()
        .setTitle('Remote laboratory')
        .setDescription('Remote laboratory API specification')
        .setVersion('2.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    /* Request data validation */
    app.useGlobalPipes(new ValidationPipe());

    /* Disable foreign keys for synchronization - SQLite issue */
    const connection = app.get(Connection);
    await connection.query('PRAGMA foreign_keys=OFF');
    await connection.synchronize();
    await connection.query('PRAGMA foreign_keys=ON');

    /* SocketIO */
    await initializeSocketIO(logger);

    await app.listen(3000);
}

async function initializeSocketIO(logger: Logger) {
    const expressApp = express();
    const socketIOServer = http.createServer(expressApp);
    const socketIO = io(socketIOServer);

    logger.setContext('SocketIO');

    socketIO.on('connection', (socket) => {
        logger.log(`Client connected, ID: ${socket.id}`);

        let token;
        let commands = '';
        let formattedCommands = '';

        socket.on('access_token', (tok) => {
            logger.log(`Client ${socket.id} authenticated with token: ${tok}`);
            token = tok;
        })

        socket.on('command', (command) => {
            logger.debug(`Command: ${command}`);

            if (command === 'whoami') {
                command = `${command}\n${token}`;
            }

            commands = `${commands}${command}\n`;
            formattedCommands = `${formattedCommands}> ${command}\n`;

            socket.emit('output', formattedCommands);
        })

        socket.on('disconnect', () => {
            logger.log(`Client ${socket.id} disconnected`);
        });
    })

    socketIOServer.listen(3001, () => logger.log(`SocketIO server listening on port 3001`));
}

bootstrap();
