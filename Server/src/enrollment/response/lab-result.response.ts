import {ApiProperty} from "@nestjs/swagger";
import {Enrollment} from "../enrollment.model";

export class LabResultResponse {

    @ApiProperty()
    labId: number;

    @ApiProperty()
    studentId: number;

    @ApiProperty()
    result: string;

    @ApiProperty()
    score: number;

    @ApiProperty()
    comment: string;

    constructor(enrollment: Enrollment) {
        this.labId = enrollment.laboratory.id;
        this.studentId = enrollment.student.id;
        this.result = enrollment.result;
        this.score = enrollment.score;
        this.comment = enrollment.comment;
    }
}