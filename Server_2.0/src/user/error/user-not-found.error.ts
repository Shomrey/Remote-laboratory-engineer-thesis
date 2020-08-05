import {HttpException, HttpStatus} from "@nestjs/common";

export class UserNotFoundError extends HttpException {
    constructor(userId: number) {
        super(`User with ID ${userId} was not found`, HttpStatus.NOT_FOUND);
    }
}