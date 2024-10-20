import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtStategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, JwtStategy, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})

export class AuthModule { }