import {HttpException, HttpStatus} from "@nestjs/common";

export class UserNotEnrolledError extends HttpException {
    constructor(userId: number, labId: number) {
        super(`User with ID ${userId} is not enrolled to lab ID ${labId}`, HttpStatus.NOT_FOUND);
    }
}