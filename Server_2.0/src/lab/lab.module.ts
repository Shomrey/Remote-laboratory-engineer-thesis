import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Lab} from "./lab.model";
import {LabService} from './lab.service';
import { LabController } from './lab.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Lab])],
    providers: [LabService],
    exports: [LabService],
    controllers: [LabController]
})
export class LabModule {
}
