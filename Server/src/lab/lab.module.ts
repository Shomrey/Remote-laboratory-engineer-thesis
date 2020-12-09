import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Lab} from "./lab.model";
import {LabService} from './lab.service';
import {LabController} from './lab.controller';
import {User} from "../user/model/user.model";
import {Enrollment} from "../enrollment/enrollment.model";

@Module({
    imports: [TypeOrmModule.forFeature([Lab, User, Enrollment])],
    providers: [LabService],
    exports: [LabService],
    controllers: [LabController]
})
export class LabModule {
}
