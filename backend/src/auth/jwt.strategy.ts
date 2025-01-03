import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        try {
            const user = await this.userService.findOne(payload.sub);

            return {
                id: payload.sub,
                login: user.login,
                displayName: user.displayName
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}