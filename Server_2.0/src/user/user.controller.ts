import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {Routes} from "../utils/constants";
import {UserResponse} from "./response/user.response";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {CurrentUser} from "../auth/decorator/current-user.decorator";
import {User} from "./model/user.model";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {LabResponse} from "../lab/response/lab.response";
import {EnrollmentResponse} from "../enrollment/response/enrollment.response";

@ApiTags(Routes.USERS)
@Controller(Routes.USERS)
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get(Routes.CURRENT)
    @UseGuards(JwtAuthGuard)
    async findCurrentUser(@CurrentUser() currentUser: User) {
        return new UserResponse(currentUser);
    }

    @Get(`${Routes.CURRENT}/labs`)
    @UseGuards(JwtAuthGuard)
    async findUserLabs(@CurrentUser() currentUser: User): Promise<LabResponse[]> {
        const labs = await this.userService.findLabsByIdAndType(currentUser.id, currentUser.userType);

        return labs.map(lab => new LabResponse(lab));
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUsers(): Promise<UserResponse[]> {
        const users = await this.userService.findAllUsers();

        return users.map(user => new UserResponse(user));
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    async findUserById(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponse> {
        const user = await this.userService.findOrFailById(userId);

        return new UserResponse(user);
    }

    @Post(`:userId/labs/:labId/enroll`)
    @UseGuards(JwtAuthGuard)
    async enrollStudentForLab(@Param('userId', ParseIntPipe) userId: number, @Param('labId', ParseIntPipe) labId: number): Promise<EnrollmentResponse> {
        const enrollment = await this.userService.enrollStudentForLab(userId, labId);

        return new EnrollmentResponse(enrollment);
    }
}
