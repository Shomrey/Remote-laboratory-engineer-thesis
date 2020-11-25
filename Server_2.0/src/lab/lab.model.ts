import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Enrollment} from "../enrollment/enrollment.model";
import {User} from "../user/model/user.model";

@Entity()
export class Lab {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column()
    duration: number;

    @Column()
    title: string;

    @Column()
    configuration: string;

    @Column({default: ''})
    collectResultsCommands: string;

    @Column()
    description: string;

    @Column()
    tasks: string;

    @Column()
    topology: string;

    @Column({name: 'max_students', default: 1})
    maxStudents: number;

    @Column({name: 'enrollment_code', nullable: true})
    enrollmentCode: string;

    @ManyToOne(type => User)
    teacher: User;

    @OneToMany(type => Enrollment, enrollment => enrollment.laboratory)
    enrollments: Enrollment[];
}