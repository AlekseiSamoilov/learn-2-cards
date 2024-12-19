import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "src/users/dto";

export interface IAuthResponse {
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
            const { password, ...result } = user.toObject();
            return result;
        }
        return null
    }

    async login(user: any) {

        const payload = {
            sub: user._id.toString(),
            login: user.login,
        };

        return {
            token: this.jwtService.sign(payload),
            user: {
                id: user._id.toString(),
                login: user.login,
                recoveryCode: user.recoveryCode,
                displayName: user.displayName,
            }
        };
    }

    async register(createUserDto: CreateUserDto): Promise<IAuthResponse> {
        try {
            const userDoc = await this.userService.create(createUserDto);
            const payload = {
                sub: userDoc._id,
                login: userDoc.login,
            }

            const token = this.jwtService.sign(payload);

            return {
                token,
                user: {
                    id: userDoc._id.toString(),
                    login: userDoc.login,
                    recoveryCode: userDoc.recoveryCode,
                    displayName: userDoc.displayName,
                }
            };
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('User with this login already exists');
            }
            throw error;
        }
    }

    async logout(userId: string): Promise<{ message: string }> {
        return { message: 'Successfully logged out' };
    }
}