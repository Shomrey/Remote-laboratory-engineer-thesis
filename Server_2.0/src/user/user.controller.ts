import {Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {Routes} from "../utils/constants";
import {UserResponse} from "./response/user.response";
import {ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {CurrentUser} from "../auth/decorator/current-user.decorator";
import {User} from "./model/user.model";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {LabResponse} from "../lab/response/lab.response";
import {EnrollmentResponse} from "../enrollment/response/enrollment.response";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags(Routes.USERS)
@Controller(Routes.USERS)
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get(Routes.CURRENT)
    @ApiOkResponse({description: 'Fetches current user\'s details', type: UserResponse})
    async findCurrentUser(@CurrentUser() currentUser: User) {
        return new UserResponse(currentUser);
    }

    @Get(`${Routes.CURRENT}/labs`)
    @ApiOkResponse({description: 'Fetches current user\'s labs', type: [LabResponse]})
    async findUserLabs(@CurrentUser() currentUser: User): Promise<LabResponse[]> {
        const labs = await this.userService.findLabsByIdAndType(currentUser.id, currentUser.userType);

        return labs.map(lab => new LabResponse(lab));
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

    @Post(`:userId/labs/:labId/enroll`)
    @ApiOkResponse({description: 'Enrolls user to the given laboratory', type: EnrollmentResponse})
    @ApiNotFoundResponse({description: 'User or lab class with given ID was not found'})
    async enrollStudentForLab(@Param('userId', ParseIntPipe) userId: number, @Param('labId', ParseIntPipe) labId: number): Promise<EnrollmentResponse> {
        const enrollment = await this.userService.enrollStudentForLab(userId, labId);

        return new EnrollmentResponse(enrollment);
    }
}
