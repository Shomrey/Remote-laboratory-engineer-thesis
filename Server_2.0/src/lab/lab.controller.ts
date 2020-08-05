import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {Routes} from "../utils/constants";
import {ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {LabService} from "./lab.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {CreateLabDto} from "./dto/create-lab.dto";
import {LabResponse} from "./response/lab.response";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags(Routes.LABS)
@Controller(Routes.LABS)
export class LabController {

    constructor(private readonly labService: LabService) {
    }

    @Get()
    @ApiOkResponse({description: 'Fetches all lab classes', type: [LabResponse]})
    async findAllLabs(): Promise<LabResponse[]> {
        const labs = await this.labService.findAll();

        return labs.map(lab => new LabResponse(lab));
    }

    @Post()
    @ApiCreatedResponse({description: 'Creates a lab class', type: LabResponse})
    @ApiNotFoundResponse({description: 'Teacher with given ID was not found'})
    async createLab(@Body() createLabDto: CreateLabDto): Promise<LabResponse> {
        const lab = await this.labService.create(createLabDto);

        return new LabResponse(lab);
    }
}
