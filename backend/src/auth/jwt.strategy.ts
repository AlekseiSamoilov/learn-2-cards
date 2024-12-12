import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
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
            console.log('JWT Payload:', payload);
            if (!payload.userId) {
                console.error('No sub in payload', payload);
                throw new Error('No user id in token payload');
            }
            const user = await this.userService.findOne(payload.userId);
            console.log('Found user:', user);

            return {
                id: user._id.toString(),
                login: user.login,
                displayName: user.displayName
            };

        } catch (error) {
            console.log('JWT validate error:', error);
            throw error;
        }
    }
}