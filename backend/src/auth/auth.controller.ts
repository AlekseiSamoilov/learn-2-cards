import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const result = await this.authService.register(createUserDto)
        return result;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        console.log('Login request user:', req.user)
        return this.authService.login(req.user)
    }
}