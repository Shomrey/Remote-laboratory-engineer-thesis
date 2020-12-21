import {
    Body,
    Controller,
    Delete,
    Get, HttpCode, HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post, Query,
    UseGuards
} from '@nestjs/common';
import {UserService} from './user.service';
import {Routes} from "../utils/constants";
import {UserResponse} from "./response/user.response";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger";
import {CurrentUser} from "../auth/decorator/current-user.decorator";
import {User} from "./model/user.model";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {LabResponse} from "../lab/response/lab.response";
import {EnrollmentResponse} from "../enrollment/response/enrollment.response";
import {SaveResultDto} from "../enrollment/dto/save-result.dto";
import {LabResultResponse} from "../enrollment/response/lab-result.response";
import EnrollWithCodeDto from "../enrollment/dto/enroll-with-code.dto";
import {GradeResultDto} from "../enrollment/dto/grade-result.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags(Routes.USERS)
@Controller(Routes.USERS)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get(Routes.CURRENT)
    @ApiOkResponse({description: 'Fetches current user\'s details', type: UserResponse})
    async findCurrentUser(@CurrentUser() currentUser: User): Promise<UserResponse> {
        return new UserResponse(currentUser);
    }

    @Get(`${Routes.CURRENT}/labs`)
    @ApiOkResponse({description: 'Fetches current user\'s labs', type: [LabResponse]})
    async findUserLabs(@CurrentUser() currentUser: User,
                       @Query('enrolled', ParseBoolPipe) enrolled: boolean): Promise<LabResponse[]> {
        if (enrolled) {
            const labs = await this.userService.findLabsByIdAndType(currentUser.id, currentUser.userType);

            return labs.map(lab => new LabResponse(lab));
        } else {
            const labs = await this.userService.getEnrollableLabs(currentUser.id);

            return labs.map(lab => new LabResponse(lab));
        }
    }

    @Patch(`${Routes.CURRENT}/labs/:labId/result`)
    @ApiOkResponse({description: 'Saves user\'s lab result'})
    async saveLabResult(@CurrentUser() currentUser: User, @Body() saveResultDto: SaveResultDto,
                        @Param('labId', ParseIntPipe) labId: number): Promise<void> {
        await this.userService.saveUserLabResult(currentUser.id, labId, saveResultDto.result);
    }

    @Get(`${Routes.CURRENT}/labs/:labId/result`)
    @ApiOkResponse({description: 'Fetches user\'s lab result'})
    async getLabResult(@CurrentUser() currentUser: User,
                       @Param('labId', ParseIntPipe) labId: number): Promise<LabResultResponse> {
        const enrollment = await this.userService.getUserLabResult(currentUser.id, labId);

        return new LabResultResponse(enrollment);
    }

    @Post(`${Routes.CURRENT}/labs/:labId/enroll-with-code`)
    @ApiOkResponse({description: 'Enrolls user to given laboratory using enrollment code'})
    @ApiNotFoundResponse({description: 'Lab class with given ID was not found'})
    @ApiBadRequestResponse({description: 'Enrollment with code failed'})
    async enrollWithCode(@CurrentUser() currentUser: User,
                         @Param('labId', ParseIntPipe) labId: number,
                         @Body() codeDto: EnrollWithCodeDto): Promise<LabResultResponse> {
        const enrollment = await this.userService.enrollStudentWithCode(currentUser.id, labId, codeDto.enrollmentCode);

        return new LabResultResponse(enrollment);
    }

    @Get()
    @ApiOkResponse({description: 'Fetches all users', type: [UserResponse]})
    async getUsers(): Promise<UserResponse[]> {
        const users = await this.userService.findAllUsers();

        return users.map(user => new UserResponse(user));
    }

    @Get(':userId')
    @ApiOkResponse({description: 'Fetches user\'s details', type: UserResponse})
    @ApiNotFoundResponse({description: 'User with given ID was not found'})
    async findUserById(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponse> {
        const user = await this.userService.findOrFailById(userId);

        return new UserResponse(user);
    }

    @Delete(':userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({description: 'User successfully deleted'})
    @ApiNotFoundResponse({description: 'User with given ID was not found'})
    async delete(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        await this.userService.deleteUser(userId);
    }

    @Post(`:userId/labs/:labId/enroll`)
    @ApiOkResponse({description: 'Enrolls user to the given laboratory', type: EnrollmentResponse})
    @ApiNotFoundResponse({description: 'User or lab class with given ID was not found'})
    async enrollStudentForLab(@Param('userId', ParseIntPipe) userId: number, @Param('labId', ParseIntPipe) labId: number): Promise<EnrollmentResponse> {
        const enrollment = await this.userService.enrollStudentForLab(userId, labId);

        return new EnrollmentResponse(enrollment);
    }

    @Patch(`:userId/labs/:labId/grade`)
    @ApiOkResponse({description: 'Grades user\'s lab result'})
    async gradeLabResult(@Body() gradeResultDto: GradeResultDto, @Param('userId', ParseIntPipe) userId: number,
                         @Param('labId', ParseIntPipe) labId: number): Promise<void> {
        await this.userService.gradeUserLabResult(userId, labId, gradeResultDto.score);
    }

    @Delete(`:userId/labs/:labId/enroll`)
    @ApiOkResponse({description: 'Removes user from the given laboratory'})
    @ApiNotFoundResponse({description: 'User or lab class with given ID was not found'})
    async removeStudentFromLab(@Param('userId', ParseIntPipe) userId: number, @Param('labId', ParseIntPipe) labId: number): Promise<void> {
        await this.userService.removeStudentFromLab(userId, labId);
    }
}
