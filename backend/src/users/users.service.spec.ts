import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UsersService } from "./users.service"
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { model } from "mongoose";
import { ObjectId } from "mongodb";

jest.mock('bcrypt');

describe('UsersService', () => {
    let service: UsersService;
    let repo: Repository<User>

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        fidByLogin: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));

        jest.clearAllMocks();
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                login: 'testUser',
                password: 'testPassword',
            };

            const hashedPassword = 'hashedPassword';
            const recoveryCode = '123456';

            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            jest.spyOn(service as any, 'generateRecoveryCode').mockResolvedValue(recoveryCode);

            const mockSavedUser = new User();

            Object.assign(mockSavedUser, {
                login: createUserDto.login,
                password: hashedPassword,
                recoveryCode,
            });

            mockRepository.create.mockReturnValue(mockSavedUser);
            mockRepository.save.mockResolvedValue({ ...mockSavedUser, id: 'someId' });

            const result = await service.create(createUserDto);

            expect(result).toEqual(expect.objectContaining({
                id: expect.any(String),
                login: createUserDto.login,
                recoveryCode: expect.any(String),
            }));
            if (result.password) {
                expect(result.password).toBe(hashedPassword);
            } else {
                expect(result.password).toBeUndefined();
            }
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, expect.any(Number));
            expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                login: createUserDto.login,
                password: hashedPassword,
                recoveryCode,
            }));
            expect(mockRepository.save).toHaveBeenCalledWith(mockSavedUser);
        });

        it('should throw InternalServcerErrorException if user already exist', async () => {
            const createUserDto: CreateUserDto = {
                login: 'existingUser',
                password: 'testPassword',
            };

            mockRepository.save.mockRejectedValue({ code: 11000 });

            await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const mockUsers = [
                { id: '1', login: 'user1', password: 'hash1', recoveryCode: 'code1' },
                { id: '2', login: 'user2', password: 'hash2', recoveryCode: 'code2' }
            ];
            mockRepository.find.mockResolvedValue(mockUsers);

            const result = await service.findAll();

            expect(result).toEqual(mockUsers);
            expect(mockRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one user by id', async () => {
            const mockUser = {
                id: new ObjectId('507f1f77bcf86cd799439011'),
                login: 'user1',
                password: 'hash1',
                recoveryCode: 'code1'
            };
            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findOne(mockUser.id.toHexString());

            expect(result).toEqual(mockUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: expect.any(ObjectId) }
            });
        });

        it('should throw NotFoundException if user not found by id', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByLogin', () => {
        it('should return one user by login', async () => {
            const mockUser = {
                id: new ObjectId('507f1f77bcf86cd799439011'),
                login: 'user1',
                password: 'hash1',
                recoveryCode: 'code1'
            };

            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findByLogin(mockUser.login);

            expect(result).toEqual(mockUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { login: expect.any(String) }
            });
        });

        it('should throw NotFoundException if user not found by login', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findByLogin('user1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update user', async () => {
            const mockUser = {
                id: new ObjectId('507f1f77bcf86cd799439011'),
                login: 'user1',
                password: 'hash1',
                recoveryCode: 'code1',
                name: 'Test User1',
                createdAt: new Date,
                updatedAt: new Date
            };

            const updateUserDto = {
                login: 'Test User2'
            };

            const updatedUser = { ...mockUser, ...updateUserDto };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

            mockRepository.findOne.mockResolvedValue(updatedUser);

            const result = await service.update(mockUser.id.toHexString(), updateUserDto);

            expect(result).toEqual(updatedUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith(mockUser.id.toHexString());
            expect(mockRepository).toHaveBeenCalledWith(updatedUser);
        });
    })

});
