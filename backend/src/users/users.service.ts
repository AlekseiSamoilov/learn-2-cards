import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ObjectId } from "mongodb";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(CreateUserDto: CreateUserDto): Promise<User> {
        try {
            const { password, ...rest } = CreateUserDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const recoveryCode = await this.generateRecoveryCode();

            const user = new User();
            Object.assign(user, {
                ...rest,
                password: hashedPassword,
                recoveryCode,
            });

            const savedUser = await this.userRepository.save(user)
            return savedUser;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user')
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return this.userRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find users ${error.message}`)
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id: new ObjectId(id) } });
            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`)
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to find user ${error.message}`)
        }
    }

    async findByLogin(login: string): Promise<User | undefined> {
        try {
            const user = await this.userRepository.findOne({ where: { login } });
            if (!user) {
                throw new NotFoundException(`User with lofin ${login} not found`)
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to found user ${error.message}`)
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findOne(id);
            if (!user) {
                throw new NotFoundException(`User with ${id} not find`);
            }
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }
            Object.assign(user, updateUserDto);
            return this.userRepository.save(user)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to update user ${error.message}`)
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.userRepository.delete(new ObjectId(id));
            if (result.affected === 0) {
                throw new NotFoundException(`User with id ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to delete user ${error.message}`)
        }
    }

    async resetPassword(login: string, recoveryCode: string, newPassword: string): Promise<void> {
        try {
            const user = await this.findByLogin(login);
            if (!user) {
                throw new NotFoundException(`User with login ${login} not found`);
            }
            if (user.recoveryCode !== recoveryCode) {
                throw new BadRequestException(`Invalud recovery code`);
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.recoveryCode = await this.generateRecoveryCode();
            await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to reset password: ${error.message}`)
        }
    }

    async generateRecoveryCode(): Promise<string> {
        return crypto.randomBytes(3).toString('hex').toUpperCase();
    }
}

