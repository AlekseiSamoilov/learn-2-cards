import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User, UserDocument } from "./user.schema";
import { CreateUserDto, UpdateUserDto } from "./dto";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const { password, ...rest } = createUserDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const recoveryCode = await this.generateRecoveryCode();

            const createdUser = new this.userModel({
                ...rest,
                password: hashedPassword,
                recoveryCode,
            });

            const savedUser = await createdUser.save();
            return savedUser;
        } catch (error) {
            if (error.code === 11000) {
                throw new BadRequestException('User with this login already exists');
            }
            throw new InternalServerErrorException(`Failed to create user: ${error.message}`)
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel.find();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find users ${error.message}`)
        }
    }

    async findOne(id: string): Promise<UserDocument> {
        try {
            if (!id) {
                throw new BadRequestException('User ID is required');
            }

            const user = await this.userModel.findById(id);

            if (!user) {
                throw new NotFoundException(`User with id ${id} not found`);
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async findByLogin(login: string): Promise<UserDocument | null> {
        try {
            const user = await this.userModel.findOne({ login });
            if (!user) {
                throw new NotFoundException(`User with login ${login} not found`)
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to found user ${error.message}`)
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        try {
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(
                id,
                { ...updateUserDto, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                throw new NotFoundException(`User with id ${id} not found`);
            }

            return updatedUser;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            if (error.name === 'ValidationError') {
                throw new BadRequestException(`Validation failed: ${error.message}`);
            }
            throw new InternalServerErrorException(`Failed to update user ${error.message}`)
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.userModel.deleteOne({ _id: id });
            if ((result as any).deletedCount === 0) {
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
                throw new BadRequestException(`Invalid recovery code`);
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.recoveryCode = await this.generateRecoveryCode();
            await user.save();
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

