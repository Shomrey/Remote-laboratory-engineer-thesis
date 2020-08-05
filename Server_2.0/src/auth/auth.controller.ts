import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {Routes} from "../utils/constants";
import {LocalAuthGuard} from "./guard/local-auth.guard";
import {LoginDto} from "./dto/login.dto";
import {AuthService} from "./auth.service";
import {Request as ExpressRequest} from "express";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserResponse} from "../user/response/user.response";
import {UserService} from "../user/user.service";

@ApiTags(Routes.AUTH)
@Controller(Routes.AUTH)
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({type: LoginDto})
    async login(@Request() request: ExpressRequest): Promise<{ access_token: string }> {
        return this.authService.login(request.user);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        return this.userService.createUser(createUserDto);
    }
}
