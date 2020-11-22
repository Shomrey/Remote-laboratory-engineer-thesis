import {HttpException, HttpStatus} from "@nestjs/common";

export class EnrollmentNotFoundError extends HttpException {
    constructor(enrollmentId: number) {
        super(`Enrollment with ID ${enrollmentId} was not found`, HttpStatus.NOT_FOUND);
    }
}