import {HttpException, HttpStatus} from "@nestjs/common";

export class EmailAlreadyUsedError extends HttpException {
    constructor(email: string) {
        super(`Email ${email} is already used`, HttpStatus.BAD_REQUEST);
    }
}