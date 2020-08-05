import {ApiProperty} from "@nestjs/swagger";
import {UserResponse} from "../../user/response/user.response";
import {Lab} from "../lab.model";

export class LabResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    date: string;

    @ApiProperty()
    duration: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    configuration: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    tasks: string;

    @ApiProperty()
    topology: string;

    @ApiProperty()
    maxStudents: number;

    @ApiProperty({type: UserResponse})
    teacher: UserResponse;

    @ApiProperty({type: UserResponse, isArray: true})
    students: UserResponse[];

    constructor(lab: Lab) {
        this.id = lab.id;
        this.date = lab.date;
        this.duration = lab.duration;
        this.title = lab.title;
        this.configuration = lab.configuration;
        this.description = lab.description;
        this.tasks = lab.tasks;
        this.topology = lab.topology;
        this.maxStudents = lab.maxStudents;
        this.teacher = lab.teacher ? new UserResponse(lab.teacher) : null;
        this.students = lab.enrollments ? lab.enrollments.map(enrollment => new UserResponse(enrollment.student)) : null;
    }
}