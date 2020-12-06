import {ApiProperty} from "@nestjs/swagger";
import {Enrollment} from "../enrollment.model";

export class EnrollmentResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    studentId: number;

    @ApiProperty()
    labId: number;

    constructor(enrollment: Enrollment) {
        this.id = enrollment.id;
        this.studentId = enrollment.student.id;
        this.labId = enrollment.laboratory.id;
    }
}