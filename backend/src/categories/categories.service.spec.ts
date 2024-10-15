import { CategoriesService } from "./categories.service"
import { Category } from "./category.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Model, Types } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { Type } from "class-transformer";


describe('CategoriesService', () => {
    let service: CategoriesService;
    let model: Model<Category>

    const mockCategoryModel = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        deleteOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getModelToken(Category.name),
                    useValue: mockCategoryModel,
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        model = module.get<Model<Category>>(getModelToken(Category.name));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createCategoryDto: CreateCategoryDto = {
            name: 'testCategory',
        };

        const mockUserId = new Types.ObjectId().toHexString();

        it('should create a new category', async () => {

            const mockCreatedCategory = {
                _id: new Types.ObjectId(),
                name: createCategoryDto.name,
                userId: mockUserId,
                save: jest.fn().mockResolvedValue({
                    _id: new Types.ObjectId(),
                    name: createCategoryDto.name,
                    userId: mockUserId,
                }),
            };

            const mockCategoryModelContructor = jest.fn(() => mockCreatedCategory);
            (service as any).categoryModel = mockCategoryModelContructor;

            const result = await service.create(createCategoryDto, mockUserId);

            expect(result).toEqual(expect.objectContaining({
                _id: expect.any(Types.ObjectId),
                name: createCategoryDto.name
            }));
            expect(mockCreatedCategory.save).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException if save fails', async () => {
            const createCategoryDto: CreateCategoryDto = {
                name: 'testCategory'
            };

            mockCategoryModel.save.mockRejectedValue(new Error('Database error'));
            await expect(service.create(createCategoryDto, mockUserId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            const mockCategories = [
                { _id: '1', name: 'category 1' },
                { _id: '2', name: 'category 2' }
            ];

            mockCategoryModel.find.mockResolvedValue(mockCategories);

            const result = await service.findAll();

            expect(result).toEqual(mockCategories);
            expect(mockCategoryModel.find).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException if find fails', async () => {

            mockCategoryModel.find.mockRejectedValue(new Error('Database error'));
            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return one category by id', async () => {

            const mockCategory = {
                _id: new Types.ObjectId().toHexString(),
                name: 'test category'
            };
            mockCategoryModel.findById.mockResolvedValue(mockCategory);

            const result = await service.findOne(mockCategory._id);

            expect(result).toEqual(mockCategory);
            expect(mockCategoryModel.findById).toHaveBeenCalledWith(mockCategory._id);
        });
    });

    it('should throw NotFoundException if category not found by id', async () => {
        mockCategoryModel.findById.mockResolvedValue(null);

        await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException)
    });

    it('should throw InternalServerExceptionError if find fails', async () => {

        const mockCategoryId = '507f1f77bcf86cd799439011';
        mockCategoryModel.findById.mockRejectedValue(new Error('Server error'));
        await expect(service.findOne(mockCategoryId)).rejects.toThrow(InternalServerErrorException)
    });

    describe('findByTitleAndUserId', () => {
        const mockUserId = new Types.ObjectId().toHexString();
        const mockName = 'testCategory';

        it('should return category by name and user id', async () => {
            const mockCategory = {
                id: new ObjectId(),
                userId: mockUserId,
                name: mockName,
            };

            mockCategoryModel.findById.mockResolvedValue(mockCategory);

            const result = await service.findByTitleAndUserId(mockName, mockUserId);
            expect(result).toEqual(mockCategory);
            expect(mockCategoryModel.findById).toHaveBeenCalledWith(mockUserId)
        });

        it('should throw NotFoundException if category not found', async () => {
            mockCategoryModel.findById.mockResolvedValue(null);

            await expect(service.findByTitleAndUserId(mockName, mockUserId)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerExceptionError if find fails', async () => {

            mockCategoryModel.findById.mockRejectedValue(new Error('Server error'));

            await expect(service.findByTitleAndUserId(mockName, mockUserId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllByUserId', () => {
        const mockUserId = '507f1f77bcf86cd799439011';

        it('should return an array of categories by userId', async () => {
            const mockCategories = [
                {
                    id: new ObjectId('60731f77bcf86cd799439022'),
                    userId: new ObjectId(mockUserId),
                    name: 'testCategory1',
                },
                {
                    id: new ObjectId('60731f77bcf86cd799439023'),
                    userId: new ObjectId(mockUserId),
                    name: 'testCategory2',
                },
                {
                    id: new ObjectId('60731f77bcf86cd799439024'),
                    userId: new ObjectId(mockUserId),
                    name: 'testCategory3',
                },
            ];

            mockCategoryModel.find.mockResolvedValue(mockCategories);

            const result = await service.findAllByUserId(mockUserId);
            expect(result).toEqual(mockCategories);
            expect(mockCategoryModel.find).toHaveBeenCalledWith({
                where: {
                    userId: expect.any(ObjectId)
                }
            });
        });
        it('should throw InternalServerExceptionError if find fails', async () => {
            mockCategoryModel.find.mockRejectedValue(new Error('Database Error'));

            await expect(service.findAllByUserId(mockUserId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update a category', async () => {
            const mockCategory = {
                userId: new ObjectId('507f1f77bcf86cd799439011'),
                id: new ObjectId('60731f77bcf86cd799439022'),
                name: 'testCategory',
                createdAt: new Date,
                updatedAt: new Date,
            };

            const updateCategoryDto = {
                name: 'updatedName'
            };

            const updatedCategory = { ...mockCategory, ...updateCategoryDto };

            // jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);
            mockCategoryModel.save.mockResolvedValue(updatedCategory);

            const result = await service.update(mockCategory.id.toHexString(), updateCategoryDto);

            expect(result).toEqual(updatedCategory);
        });

        it('should trow NotFoundException if category was not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null)

            await expect(service.update('60731f77bcf86cd799439022', {})).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException for any error other than NotFoundException', async () => {
            const mockError = new Error('Database connection failed');
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Database Error'));

            await expect(service.update('60731f77bcf86cd799439022', { name: 'Updated Category' }))
                .rejects.toThrow(InternalServerErrorException);

            await expect(service.update('60731f77bcf86cd799439022', { name: 'Updated Category' }))
                .rejects.toThrow('Failed to update category: Database Error');
        });
    });

    describe('remove', () => {

        it('should remove a category', async () => {
            const mockId = new ObjectId().toHexString();
            mockCategoryModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            await expect(service.remove(mockId)).resolves.not.toThrow();
            expect(mockCategoryModel.deleteOne).toHaveBeenCalledWith(new ObjectId(mockId));
        });

        it('should throw NotFoundException if category was not found', async () => {
            const mockId = new ObjectId().toHexString();
            mockCategoryModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

            await expect(service.remove(mockId)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException if remove fail', async () => {
            const mockId = new ObjectId().toHexString();
            mockCategoryModel.deleteOne.mockRejectedValue(new Error('Database Error'));

            await expect(service.remove(mockId)).rejects.toThrow(InternalServerErrorException);
        });
    });


})
