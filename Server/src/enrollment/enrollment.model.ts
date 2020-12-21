import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "../user/model/user.model";
import {Lab} from "../lab/lab.model";

@Entity()
@Unique(['student', 'laboratory'])
export class Enrollment {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.enrollments, {onDelete: 'CASCADE'})
    @JoinColumn()
    student: User;

    @ManyToOne(type => Lab, lab => lab.enrollments, {onDelete: 'CASCADE'})
    @JoinColumn()
    laboratory: Lab;

    @Column({nullable: true})
    result: string;

    @Column({default: 0})
    score: number;

    @Column({nullable: true})
    comment: string;
}