import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";

export class LoginDto {

    @ApiProperty({format: 'email'})
    @IsEmail()
    mail: string;

    @ApiProperty()
    @IsString()
    password: string;
}