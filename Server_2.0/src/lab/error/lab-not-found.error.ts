import {HttpException, HttpStatus} from "@nestjs/common";

export class LabNotFoundError extends HttpException {
    constructor(labId: number) {
        super(`Lab with ID ${labId} was not found`, HttpStatus.NOT_FOUND);
    }
}