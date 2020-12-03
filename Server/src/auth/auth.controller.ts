import {Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {Routes} from "../utils/constants";
import {LocalAuthGuard} from "./guard/local-auth.guard";
import {LoginDto} from "./dto/login.dto";
import {AuthService} from "./auth.service";
import {Request as ExpressRequest} from "express";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserResponse} from "../user/response/user.response";
import {UserService} from "../user/user.service";
import {AccessTokenResponse} from "./response/access-token.response";

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
    @HttpCode(HttpStatus.OK)
    @ApiBody({type: LoginDto})
    @ApiOkResponse({description: 'Returns an access token'})
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    async login(@Request() request: ExpressRequest): Promise<AccessTokenResponse> {
        return this.authService.login(request.user);
    }

    @Post('register')
    @ApiCreatedResponse({description: 'Creates an user', type: UserResponse})
    @ApiBadRequestResponse({description: 'Email already in use'})
    async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
        return this.userService.createUser(createUserDto);
    }
}
