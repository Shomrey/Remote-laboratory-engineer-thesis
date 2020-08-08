import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {INestApplication, Logger, ValidationPipe} from "@nestjs/common";
import {Connection} from "typeorm";
import io = require('socket.io');
import {DEFAULT_PORT} from "./utils/constants";

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
    await initializeSocketIO(logger, app);

    /* Enable CORS from testing in chrome */
    app.enableCors();

    await app.listen(process.env.PORT || DEFAULT_PORT);
}

async function initializeSocketIO(logger: Logger, app: INestApplication) {
    const socketIO = io(app.getHttpServer());

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
            if (!token) {
                logger.log(`Unauthenticated command from ${socket.id}`);
            } else {
                logger.debug(`Command: ${command}`);

                if (command === 'whoami') {
                    command = `${command}\n${token}`;
                }

                commands = `${commands}${command}\n`;
                formattedCommands = `${formattedCommands}> ${command}\n`;

                socket.emit('output', formattedCommands);
            }
        })

        socket.on('disconnect', () => {
            logger.log(`Client ${socket.id} disconnected`);
        });
    })

    logger.log(`SocketIO initialized`);
}

bootstrap();
