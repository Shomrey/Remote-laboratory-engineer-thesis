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

    @Column()
    description: string;

    @Column()
    tasks: string;

    @Column()
    topology: string;

    @Column({name: 'max_student', default: 1})
    maxStudents: number;

    @ManyToOne(type => User)
    teacher: User;

    @OneToMany(type => Enrollment, enrollment => enrollment.laboratory)
    enrollments: Enrollment[];
}