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
import {LabNotFoundError} from "../lab/error/lab-not-found.error";

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

    async enrollStudentForLab(studentId: number, labId: number): Promise<Enrollment> {
        const user = await this.findOrFailById(studentId);

        if (!user) {
            throw new UserNotFoundError(studentId);
        }

        const lab = await this.labService.findOrFailById(labId);

        if (!lab) {
            throw new LabNotFoundError(labId);
        }

        return this.enrollmentService.enrollStudentForLab(studentId, labId);
    }
}
