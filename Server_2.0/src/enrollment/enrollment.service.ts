import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Enrollment} from "./enrollment.model";
import {Repository} from "typeorm";
import {EnrollmentNotFoundError} from "./error/enrollment-not-found.error";

@Injectable()
export class EnrollmentService {
    constructor(@InjectRepository(Enrollment) private readonly enrollmentRepository: Repository<Enrollment>) {
    }

    async findOrFailById(enrollmentId: number): Promise<Enrollment> {
        const enrollment = await this.enrollmentRepository.findOne({id: enrollmentId});

        if (!enrollment) {
            throw new EnrollmentNotFoundError(enrollmentId);
        }

        return enrollment;
    }

    async enrollStudentForLab(studentId: number, labId: number): Promise<Enrollment> {
        return this.enrollmentRepository.save({
                student: {id: studentId},
                laboratory: {id: labId}
            }
        );
    }
}
