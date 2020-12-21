import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import {Routes} from "../utils/constants";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {LabService} from "./lab.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {CreateLabDto} from "./dto/create-lab.dto";
import {LabResponse} from "./response/lab.response";
import {UpdateLabDto} from "./dto/update-lab.dto";
import {LabResultResponse} from "../enrollment/response/lab-result.response";

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

    @Patch(':labId')
    @ApiCreatedResponse({description: 'Updates a lab class'})
    @ApiNotFoundResponse({description: 'Teacher or lab class with given ID was not found'})
    async updateLab(@Param('labId', ParseIntPipe) labId: number, @Body() updateLabDto: UpdateLabDto): Promise<void> {
        await this.labService.update(labId, updateLabDto);
    }

    @Delete(':labId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({description: 'Lab successfully removed'})
    @ApiNotFoundResponse({description: 'Lab class with given ID was not found'})
    async deleteLab(@Param('labId', ParseIntPipe) labId: number): Promise<void> {
        await this.labService.delete(labId);
    }

    @Get(':labId/results')
    @ApiOkResponse({description: 'Fetches results of given laboratory', type: [LabResultResponse]})
    @ApiNotFoundResponse({description: 'Laboratory with given ID was not found'})
    async getLabResults(@Param('labId', ParseIntPipe) labId: number): Promise<LabResultResponse[]> {
        const enrollments = await this.labService.getLabResults(labId);

        return enrollments.map(enrollment => new LabResultResponse(enrollment));
    }
}
