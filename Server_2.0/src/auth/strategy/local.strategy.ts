import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {InvalidUserCredentialsError} from "../error/invalid-user-credentials.error";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'mail',
            passwordField: 'password'
        });
    }

    async validate(mail: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(mail, password);

        if (!user) {
            throw new InvalidUserCredentialsError();
        }

        return user;
    }
}