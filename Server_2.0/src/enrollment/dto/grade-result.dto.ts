import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class GradeResultDto {

    @ApiProperty()
    @IsString()
    score!: number;
}