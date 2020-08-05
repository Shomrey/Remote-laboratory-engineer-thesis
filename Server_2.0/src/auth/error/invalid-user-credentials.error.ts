import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidUserCredentialsError extends HttpException {
    constructor() {
        super('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }
}