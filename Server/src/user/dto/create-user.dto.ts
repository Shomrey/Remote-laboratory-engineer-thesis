import {ApiProperty} from "@nestjs/swagger";
import {UserType} from "../../utils/constants";
import {IsEmail, IsIn, IsString} from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    surname: string;

    @ApiProperty({format: 'email'})
    @IsEmail()
    mail: string;

    @ApiProperty()
    @IsString()
    passwordHash: string;

    @ApiProperty({enum: UserType})
    @IsIn([UserType.STUDENT, UserType.TEACHER, UserType.ADMIN])
    userType: UserType;
}