import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export default class EnrollWithCodeDto {

    @ApiProperty()
    @IsString()
    enrollmentCode: string;
}