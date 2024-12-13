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
        console.log('1. JWT Strategy validate - payload:', payload);
        console.log('2. JWT Strategy validate - payload.sub:', payload.sub);
        try {
            const user = await this.userService.findOne(payload.sub);
            console.log('3. JWT Strategy validate - found user:', user);

            return {
                id: payload.sub,
                login: user.login,
                displayName: user.displayName
            };
        } catch (error) {
            console.error('JWT validate error:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}