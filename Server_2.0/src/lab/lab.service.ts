import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Lab} from "./lab.model";
import {Repository} from "typeorm";
import {LabNotFoundError} from "./error/lab-not-found.error";
import {CreateLabDto} from "./dto/create-lab.dto";

@Injectable()
export class LabService {
    constructor(@InjectRepository(Lab) private readonly labRepository: Repository<Lab>) {
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
        return this.labRepository.save({...createLabDto, teacher: {id: createLabDto.teacherId}});
    }

    async findAll(): Promise<Lab[]> {
        return this.labRepository.find({relations: ['enrollments', 'enrollments.student', 'teacher']});
    }
}