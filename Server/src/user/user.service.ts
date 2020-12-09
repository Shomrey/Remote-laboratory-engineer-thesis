import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "./model/user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserNotFoundError} from "./error/user-not-found.error";
import {EmailAlreadyUsedError} from "./error/email-already-used.error";
import {UserType} from "../utils/constants";
import {Lab} from "../lab/lab.model";
import {LabService} from "../lab/lab.service";
import {EnrollmentService} from "../enrollment/enrollment.service";
import {Enrollment} from "../enrollment/enrollment.model";
import {UserAlreadyEnrolledError} from "../enrollment/error/user-already-enrolled.error";
import {UserNotEnrolledError} from "../enrollment/error/user-not-enrolled.error";
import {CannotEnrollWithCodeError} from "../lab/error/cannot-enroll-with-code.error";
import {InvalidCodeError} from "../lab/error/invalid-code.error";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User)
                private readonly userRepository: Repository<User>,
                private readonly labService: LabService,
                private readonly enrollmentService: EnrollmentService) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        if (await this.findByEmail(createUserDto.mail)) {
            throw new EmailAlreadyUsedError(createUserDto.mail);
        }

        return this.userRepository.save(createUserDto);
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOrFailById(userId: number): Promise<User> {
        const user = await this.userRepository.findOne(userId);

        if (!user) {
            throw new UserNotFoundError(userId);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({where: {mail: email}})
    }

    async findByIdWithEnrolledLabs(userId: number): Promise<User> {
        return this.userRepository.findOne(userId, {relations: ['enrollments', 'enrollments.laboratory', 'enrollments.laboratory.teacher']})
    }

    async findLabsByIdAndType(userId: number, userType: UserType): Promise<Lab[]> {
        const user = await this.findByIdWithEnrolledLabs(userId);

        return userType === UserType.STUDENT ?
            user.enrollments.map(enrollment => enrollment.laboratory)
            :
            this.labService.findByTeacherId(userId);
    }

    async getEnrollableLabs(userId: number): Promise<Lab[]> {
        const user = await this.findByIdWithEnrolledLabs(userId);
        const labs = await this.labService.findAll();

        return labs.filter(lab => !user.enrollments.some(enrollment => enrollment.laboratory.id === lab.id)
            && lab.enrollmentCode !== null
            && lab.enrollmentCode !== '');
    }

    async enrollStudentForLab(studentId: number, labId: number): Promise<Enrollment> {
        const user = await this.findOrFailById(studentId);
        const lab = await this.labService.findOrFailById(labId);
        const enrollment = await this.enrollmentService.findByStudentIdAndLabId(studentId, labId);

        if (enrollment) {
            throw new UserAlreadyEnrolledError(studentId, labId);
        }

        return this.enrollmentService.enrollStudentForLab(user.id, lab.id);
    }

    async enrollStudentWithCode(studentId: number, labId: number, code: string): Promise<Enrollment> {
        const user = await this.findOrFailById(studentId);
        const lab = await this.labService.findOrFailById(labId);
        const enrollment = await this.enrollmentService.findByStudentIdAndLabId(studentId, labId);

        if (enrollment) {
            throw new UserAlreadyEnrolledError(studentId, labId);
        }

        if (!lab.enrollmentCode || lab.enrollmentCode === '') {
            throw new CannotEnrollWithCodeError();
        }

        if (lab.enrollmentCode !== code) {
            throw new InvalidCodeError();
        }

        return this.enrollmentService.enrollStudentForLab(user.id, lab.id);
    }

    async removeStudentFromLab(studentId: number, labId: number): Promise<void> {
        const user = await this.findOrFailById(studentId);
        const lab = await this.labService.findOrFailById(labId);

        await this.enrollmentService.removeStudentFromLab(user.id, lab.id);
    }

    async saveUserLabResult(userId: number, labId: number, result: string): Promise<void> {
        const enrollment = await this.enrollmentService.findByStudentIdAndLabId(userId, labId);

        if (!enrollment) {
            throw new UserNotEnrolledError(userId, labId)
        }

        await this.enrollmentService.saveStudentLabResult(userId, labId, result);
    }

    async getUserLabResult(userId: number, labId: number): Promise<Enrollment> {
        const enrollment = await this.enrollmentService.findByStudentIdAndLabId(userId, labId);

        if (!enrollment) {
            throw new UserNotEnrolledError(userId, labId)
        }

        return this.enrollmentService.findByStudentIdAndLabId(userId, labId);
    }

    async gradeUserLabResult(userId: number, labId: number, score: number): Promise<void> {
        const enrollment = await this.enrollmentService.findByStudentIdAndLabId(userId, labId);

        if (!enrollment) {
            throw new UserNotEnrolledError(userId, labId)
        }

        await this.enrollmentService.gradeStudentLabResult(userId, labId, score);
    }
}
