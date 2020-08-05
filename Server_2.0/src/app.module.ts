import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from './user/user.module';
import {LabModule} from './lab/lab.module';
import {EnrollmentModule} from './enrollment/enrollment.module';
import {User} from "./user/model/user.model";
import {Lab} from "./lab/lab.model";
import {Enrollment} from "./enrollment/enrollment.model";
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database',
            entities: [User, Lab, Enrollment],
            logging: 'all'
        }),
        UserModule,
        EnrollmentModule,
        LabModule,
        AuthModule
    ]
})
export class AppModule {
}
