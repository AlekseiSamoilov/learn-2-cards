import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from "src/users/users.service";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
    constructor(private userService: UsersService) {
        super({
            jstFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return this.userService.findOne(payload.sub);
    }
}