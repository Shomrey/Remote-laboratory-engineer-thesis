import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreateLabDto {

    @ApiProperty()
    @IsString()
    date: string;

    @ApiProperty()
    @IsNumber()
    duration: number;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    configuration: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    tasks: string;

    @ApiProperty()
    @IsString()
    topology: string;

    @ApiProperty()
    @IsNumber()
    maxStudents: number;

    @ApiProperty()
    @IsNumber()
    teacherId: number;

    @ApiProperty()
    @IsString()
    enrollmentCode: string;
}