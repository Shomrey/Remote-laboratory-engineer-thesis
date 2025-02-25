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
import {UpdateLabDto} from "./dto/update-lab.dto";
import {Enrollment} from "../enrollment/enrollment.model";

@Injectable()
export class LabService {
    constructor(@InjectRepository(Lab) private readonly labRepository: Repository<Lab>,
                @InjectRepository(User) private readonly userRepository: Repository<User>,
                @InjectRepository(Enrollment) private readonly enrollmentRepository: Repository<Enrollment>) {
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
        await this.validateTeacher(createLabDto.teacherId);

        return this.labRepository.save({...createLabDto, teacher: {id: createLabDto.teacherId}});
    }

    async update(labId: number, updateLabDto: UpdateLabDto): Promise<void> {
        await this.findOrFailById(labId);

        delete (updateLabDto as any).id;

        if (Object.keys(updateLabDto).length === 0) {
            return;
        }

        if (updateLabDto.teacherId) {
            await this.validateTeacher(updateLabDto.teacherId);

            const {teacherId, ...updatedData} = updateLabDto;
            await this.labRepository.update(labId, {...updatedData, teacher: {id: teacherId}});
        } else {
            await this.labRepository.update(labId, updateLabDto);
        }
    }

    async delete(labId: number): Promise<void> {
        const lab = await this.findOrFailById(labId);

        await this.labRepository.remove(lab);
    }

    async findAll(): Promise<Lab[]> {
        return this.labRepository.find({relations: ['enrollments', 'enrollments.student', 'teacher']});
    }

    async getLabResults(labId: number): Promise<Enrollment[]> {
        const lab = await this.findOrFailById(labId);

        return this.enrollmentRepository.find({
            where: {laboratory: {id: lab.id}},
            relations: ['laboratory', 'student']
        });
    }

    private async validateTeacher(teacherId: number): Promise<void> {
        const teacher = await this.userRepository.findOne({id: teacherId});

        if (!teacher) {
            throw new UserNotFoundError(teacherId);
        }

        if (teacher.userType == UserType.STUDENT) {
            throw new InvalidTeacherError();
        }
    }
}