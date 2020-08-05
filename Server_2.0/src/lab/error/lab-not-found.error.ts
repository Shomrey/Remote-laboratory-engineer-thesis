import {HttpException, HttpStatus} from "@nestjs/common";

export class LabNotFoundError extends HttpException {
    constructor(userId: number) {
        super(`Lab with ID ${userId} was not found`, HttpStatus.NOT_FOUND);
    }
}