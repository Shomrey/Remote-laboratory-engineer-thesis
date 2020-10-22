import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class SaveResultDto {

    @ApiProperty()
    @IsString()
    result!: string;
}