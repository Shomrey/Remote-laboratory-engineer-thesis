import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Enrollment} from "../../enrollment/enrollment.model";
import {UserType} from "../../utils/constants";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({unique: true})
    mail: string;

    @Column({name: 'password_hash'})
    passwordHash: string;

    @Column({name: 'user_type', enum: UserType})
    userType: UserType;

    @OneToMany(type => Enrollment, enrollment => enrollment.student)
    enrollments: Enrollment[];
}