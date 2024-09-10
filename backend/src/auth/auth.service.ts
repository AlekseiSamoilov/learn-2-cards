import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { access } from "fs";
import { CreateUserDto } from "src/users/dto";
import { create } from "domain";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(login: string, password: string): Promise<any> {
        const user = await this.userService.findByLogin(login);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null
    }

    async login(user: any) {
        const payload = { login: user.login, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.create(createUserDto);
            const { password, ...result } = user;
            return result;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User with this login already exists');
            }
            throw error;
        }
    }
}