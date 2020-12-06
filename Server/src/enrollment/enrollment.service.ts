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

    async findByStudentIdAndLabId(studentId: number, labId: number): Promise<Enrollment> {
        return this.enrollmentRepository.findOne({
            where: {
                student: {id: studentId},
                laboratory: {id: labId},
            },
            relations: ['student', 'laboratory']
        });
    }

    async enrollStudentForLab(studentId: number, labId: number): Promise<Enrollment> {
        return this.enrollmentRepository.save({
                student: {id: studentId},
                laboratory: {id: labId}
            }
        );
    }

    async removeStudentFromLab(studentId: number, labId: number): Promise<void> {
        await this.enrollmentRepository.delete({
                student: {id: studentId},
                laboratory: {id: labId}
            }
        );
    }

    async saveStudentLabResult(studentId: number, labId: number, result: string): Promise<void> {
        await this.enrollmentRepository.update({
            student: {id: studentId},
            laboratory: {id: labId}
        }, {result})
    }

    async gradeStudentLabResult(studentId: number, labId: number, score: number): Promise<void> {
        await this.enrollmentRepository.update({
            student: {id: studentId},
            laboratory: {id: labId}
        }, {score})
    }
}
