import {ApiProperty} from "@nestjs/swagger";
import {UserType} from "../../utils/constants";
import {User} from "../model/user.model";

export class UserResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    surname: string;

    @ApiProperty({format: 'email'})
    mail: string;

    @ApiProperty({enum: UserType})
    userType: string;

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.mail = user.mail;
        this.userType = user.userType;
    }
}