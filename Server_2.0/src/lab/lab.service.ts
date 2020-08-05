import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Lab} from "./lab.model";
import {Repository} from "typeorm";
import {LabNotFoundError} from "./error/lab-not-found.error";
import {CreateLabDto} from "./dto/create-lab.dto";
import {User} from "../user/model/user.model";
import {UserNotFoundError} from "../user/error/user-not-found.error";
import {UserType} from "../utils/constants";
import {InvalidTeacherError} from "./error/invalid-teacher.error";

@Injectable()
export class LabService {
    constructor(@InjectRepository(Lab) private readonly labRepository: Repository<Lab>,
                @InjectRepository(User) private readonly userRepository: Repository<User>) {
    }

    async findOrFailById(labId: number): Promise<Lab> {
        const lab = await this.labRepository.findOne({id: labId});

        if (!lab) {
            throw new LabNotFoundError(labId);
        }

        return lab;
    }

    async findByTeacherId(teacherId: number): Promise<Lab[]> {
        return this.labRepository.find({where: {teacher: {id: teacherId}}});
    }

    async create(createLabDto: CreateLabDto): Promise<Lab> {
        const teacher = await this.userRepository.findOne({id: createLabDto.teacherId});

        if (!teacher) {
            throw new UserNotFoundError(createLabDto.teacherId);
        }

        if (teacher.userType == UserType.STUDENT) {
            throw new InvalidTeacherError();
        }

        return this.labRepository.save({...createLabDto, teacher: {id: createLabDto.teacherId}});
    }

    async findAll(): Promise<Lab[]> {
        return this.labRepository.find({relations: ['enrollments', 'enrollments.student', 'teacher']});
    }
}