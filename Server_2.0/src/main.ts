import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import {Connection} from "typeorm";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    await app.listen(3000);
}

bootstrap();
