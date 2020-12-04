import {HttpException, HttpStatus} from "@nestjs/common";

export class UserAlreadyEnrolledError extends HttpException {
    constructor(userId: number, labId: number) {
        super(`User with ID ${userId} is already enrolled for laboratory with ID ${labId}`, HttpStatus.BAD_REQUEST);
    }
}