import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class GradeResultDto {

    @ApiProperty()
    @IsNumber()
    score!: number;
}