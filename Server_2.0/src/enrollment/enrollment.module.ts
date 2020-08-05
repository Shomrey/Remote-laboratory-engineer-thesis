import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Enrollment} from "./enrollment.model";
import {EnrollmentService} from './enrollment.service';

@Module({
    imports: [TypeOrmModule.forFeature([Enrollment])],
    providers: [EnrollmentService],
    exports: [EnrollmentService]
})
export class EnrollmentModule {
}
