import {HttpException, HttpStatus} from "@nestjs/common";

export class EnrollmentNotFoundError extends HttpException {
    constructor(userId: number) {
        super(`Enrollment with ID ${userId} was not found`, HttpStatus.NOT_FOUND);
    }
}