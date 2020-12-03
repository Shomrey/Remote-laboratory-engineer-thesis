import {Module} from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./model/user.model";
import {LabModule} from "../lab/lab.module";
import {EnrollmentModule} from "../enrollment/enrollment.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        LabModule,
        EnrollmentModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule, UserService]
})
export class UserModule {
}