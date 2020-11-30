import {HttpException, HttpStatus} from "@nestjs/common";

export class CannotEnrollWithCodeError extends HttpException {
    constructor() {
        super(`This laboratory does not accept code enrollments`, HttpStatus.BAD_REQUEST);
    }
}