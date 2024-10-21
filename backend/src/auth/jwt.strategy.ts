import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(private configService: ConfigService) {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        });

        this.logger.debug(`Configuring JwtStrategy. JWT_SECRET is ${jwtSecret ? 'set' : 'not set'}`);
        if (!jwtSecret) {
            this.logger.error('JWT_SECRET is not set. This will cause an error.');
        }
    }

    async validate(payload: any) {
        return { userId: payload.sub, login: payload.login };
    }
}