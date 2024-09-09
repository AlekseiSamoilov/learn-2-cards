import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { isValidObjectId } from "mongoose";

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
            const user = this.userRepository.create({
                ...rest,
                password: hashedPassword,
            });
            return this.userRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user')
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return this.userRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Failed to find users')
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            if (!isValidObjectId(id)) {
                throw new BadRequestException(`Invalid user id ${id}`)
            }
            const user = await this.userRepository.findOne({ where: { id } });
            if (!id) {
                throw new NotFoundException(`User with id ${id} not find`)
            }
            return user;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to find user ${error.message}`)
        }
    }
}

