import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {Logger, ValidationPipe} from "@nestjs/common";
import {Connection} from "typeorm";
import {DEFAULT_PORT} from "./utils/constants";
import initializeSocketIO from "./socketio/socketio-listener";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false
    });

    const logger = new Logger();
    app.useLogger(logger);
    app.setGlobalPrefix('/api');

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
    if (!process.env.HEROKU) {
        const connection = app.get(Connection);
        await connection.query('PRAGMA foreign_keys=OFF');
        await connection.synchronize();
        await connection.query('PRAGMA foreign_keys=ON');
    }

    /* SocketIO */
    await initializeSocketIO(logger, app);

    /* Enable CORS from testing in chrome */
    app.enableCors();

    await app.listen(process.env.PORT || DEFAULT_PORT);
}

bootstrap();
