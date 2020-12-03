import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidTeacherError extends HttpException {
    constructor() {
        super(`Students cannot be set as teacher in lab classes`, HttpStatus.BAD_REQUEST);
    }
}