import { User, UserDocument } from "./user.schema";
import { UsersService } from "./users.service"
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Model, Document } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";


jest.mock('bcrypt');

describe('UsersService', () => {
    let service: UsersService;
    let model: Model<UserDocument>

    const mockUserModel = {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        deleteOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        model = module.get<Model<UserDocument>>(getModelToken(User.name));

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

            const mockCreateUser = {
                _id: 'testID',
                login: createUserDto.login,
                password: hashedPassword,
                recoveryCode,
                save: jest.fn().mockResolvedValue({
                    _id: 'testID',
                    login: createUserDto.login,
                    password: hashedPassword,
                    recoveryCode,
                }),
            };

            mockUserModel.create.mockReturnValue(mockCreateUser);

            const result = await service.create(createUserDto);

            expect(result).toEqual(expect.objectContaining({
                _id: 'testId',
                login: createUserDto.login,
                recoveryCode: expect.any(String),
            }));

            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
            expect(mockUserModel.create).toHaveBeenCalledWith(expect.objectContaining({
                login: createUserDto.login,
                password: hashedPassword,
                recoveryCode,
            }));
        });

        it('should throw InternalServcerErrorException if user already exist', async () => {
            const createUserDto: CreateUserDto = {
                login: 'existingUser',
                password: 'testPassword',
            };

            mockUserModel.create.mockRejectedValue({ code: 11000 });

            await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const mockUsers = [
                { id: '1', login: 'user1', password: 'hash1', recoveryCode: 'code1' },
                { id: '2', login: 'user2', password: 'hash2', recoveryCode: 'code2' }
            ];
            mockUserModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUsers)
            });

            const result = await service.findAll();

            expect(result).toEqual(mockUsers);
            expect(mockUserModel.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one user by id', async () => {
            const mockUser = {
                _id: '507f1f77bcf86cd799439011',
                login: 'user1',
                password: 'hash1',
                recoveryCode: 'code1'
            };

            mockUserModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await service.findOne(mockUser._id);

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith(mockUser._id);
        });

        it('should throw NotFoundException if user not found by id', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            })

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

            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.findByLogin(mockUser.login);

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({
                login: mockUser.login,
            });
        });

        it('should throw NotFoundException if user not found by login', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            });

            await expect(service.findByLogin('user1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update user', async () => {
            const mockUser = {
                _id: '507f1f77bcf86cd799439011',
                login: 'testUser',
                recoveryCode: '123456',
                password: 'oldpassword',
            };

            const updateUserDto = {
                login: 'newuser2'
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as UserDocument);

            const result = await service.update(mockUser._id, updateUserDto);

            expect(result).toEqual(expect.objectContaining({
                _id: mockUser._id,
                login: updateUserDto.login
            }));
            expect(service.findOne).toHaveBeenCalledWith(mockUser._id);
            expect(mockUserModel.findById).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user was not found', async () => {
            jest.spyOn(mockUserModel, 'findOne').mockRejectedValue(new NotFoundException());

            await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const mockId = new ObjectId().toHexString();
            mockUserModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            await expect(service.remove(mockId)).resolves.not.toThrow();
            expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ _id: mockId });
        });

        it('should throw NotFoundException if user not found', async () => {
            const mockId = new ObjectId().toHexString();
            mockUserModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

            await expect(service.remove(mockId)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalErrorException on unexpected error', async () => {
            const mockId = new ObjectId().toHexString();
            mockUserModel.deleteOne.mockRejectedValue(new Error('Unexpected error'));

            await expect(service.remove(mockId)).rejects.toThrow(InternalServerErrorException)
        });
    });

    describe('resetPassword', () => {
        it('should reset password', async () => {
            const mockUser: Partial<UserDocument> = {
                login: 'testUser',
                recoveryCode: '123456',
                password: 'oldpassword',
                createdAt: new Date(),
                updatedAt: new Date(),
                save: jest.fn().mockResolvedValue({
                    login: 'testUser',
                    recoveryCode: 'NEW1234',
                    password: 'hashedPassword',
                })
            };
            const newPassword = 'newpassword';

            jest.spyOn(service, 'findByLogin').mockResolvedValue(mockUser as UserDocument);
            jest.spyOn(service, 'generateRecoveryCode').mockResolvedValue('NEW1234');
            jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword' as never));

            await expect(service.resetPassword(mockUser.login, mockUser.recoveryCode, newPassword)).resolves.not.toThrow();
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockUser.password).toBe('hashedPassword');
            expect(mockUser.recoveryCode).toBe('NEW1234');
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(service, 'findByLogin').mockResolvedValue(null);

            await expect(service.resetPassword('nonexistent', 'ABC123', 'newPassword')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if recovery code is invalid', async () => {
            const mockUser = {
                login: 'testUser',
                recoveryCode: 'ABC123',
            };

            jest.spyOn(service, 'findByLogin').mockResolvedValue(mockUser as UserDocument);

            await expect(service.resetPassword(mockUser.login, 'WRONG123', 'newPassword')).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalSErverErrorException on unexpected error', async () => {
            jest.spyOn(service, 'findByLogin').mockRejectedValue(new Error('Unexpected Error'));

            await expect(service.resetPassword('testUser', 'ABC123', 'newPassword')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('generateRecoveryCode', () => {
        it('should generate unique codes on subsequent calls', async () => {
            const code1 = await service.generateRecoveryCode();
            const code2 = await service.generateRecoveryCode();
            expect(code1).not.toEqual(code2);
        });
    });
});

