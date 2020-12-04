import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {AuthController} from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {LocalStrategy} from "./strategy/local.strategy";
import {JWT_SECRET} from "../utils/constants";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        PassportModule,
        UserModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {expiresIn: '24h'}
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {
}
