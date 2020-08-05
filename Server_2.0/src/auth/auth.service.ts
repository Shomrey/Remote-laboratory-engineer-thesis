import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) {
    }

    async validateUser(mail: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(mail);

        if (user && user.passwordHash === password) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {passwordHash, ...data} = user;

            return data;
        }

        return null;
    }

    async login(user: any): Promise<{ access_token: string }> {
        const payload = {mail: user.mail, sub: user.id};

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getUserByJwt(payload: any): Promise<any> {
        const user = await this.userService.findOrFailById(payload.sub);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {passwordHash, ...data} = user;

        return data;
    }
}
