import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "src/users/dto";
import { response } from "express";

interface IAuthResponse {
    token: string;
    user: {
        id: string;
        login: string;
        recoveryCode: string;
        displayName?: string;
    }
}

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
            token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                login: user.login,
                recoveryCode: user.recoveryCode,
                displayName: user.displayName,
            }
        };
    }

    async register(createUserDto: CreateUserDto): Promise<IAuthResponse> {
        try {
            const userDoc = await this.userService.create(createUserDto);
            const payload = { login: userDoc.login, sub: userDoc._id };
            const token = this.jwtService.sign(payload);

            const response: IAuthResponse = {
                token,
                user: {
                    id: userDoc._id.toString(),
                    login: userDoc.login,
                    recoveryCode: userDoc.recoveryCode,
                    displayName: userDoc.displayName,
                }
            };
            console.log('Auth service response:', response);
            return response;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User with this login already exists');
            }
            throw error;
        }
    }
}