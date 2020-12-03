import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidCodeError extends HttpException {
    constructor() {
        super(`Invalid enrollment code`, HttpStatus.BAD_REQUEST);
    }
}