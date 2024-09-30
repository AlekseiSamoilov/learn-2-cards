import { Repository } from "typeorm";
import { CategoriesService } from "./categories.service"
import { Category } from "./category.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { InternalServerErrorException } from "@nestjs/common";
import { ObjectId } from "mongodb";

describe('CategoriesService', () => {
    let service: CategoriesService;
    let repo: Repository<Category>

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        repo = module.get<Repository<Category>>(getRepositoryToken(Category));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const createCategoryDto: CreateCategoryDto = {
                name: 'testCategory',
            };

            const mockSavedCategory = {
                id: 'testId',
                name: createCategoryDto.name,
            };

            mockRepository.save.mockResolvedValue(mockSavedCategory);

            const result = await service.create(createCategoryDto);

            expect(result).toEqual(expect.objectContaining({
                id: 'testId',
                name: createCategoryDto.name
            }));
            expect(mockRepository.save).toHaveBeenCalledWith(createCategoryDto);
        });

        it('should throw an InternalServerErrorException if save fails', async () => {
            const createCategoryDto: CreateCategoryDto = {
                name: 'testCategory'
            };

            mockRepository.save.mockRejectedValue(new Error('Database error'));
            await expect(service.create(createCategoryDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            const mockCategories = [
                { id: '1', name: 'category 1' },
                { id: '2', name: 'category 2' }
            ];

            mockRepository.find.mockResolvedValue(mockCategories);

            const result = await service.findAll();

            expect(result).toEqual(mockCategories);
            expect(mockRepository.find).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException if find fails', async () => {
            const mockCategories = [
                { id: '1', name: 'category 1' },
                { id: '2', name: 'category 2' }
            ];

            mockRepository.find.mockRejectedValue(new Error('Database error'));
            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });
    describe('findOne', () => {
        it('should return one category by id', async () => {
            const mockId = '507f1f77bcf86cd799439011';
            const mockCategory = {
                id: new ObjectId(mockId),
                name: 'test category'
            };
            mockRepository.findOne.mockResolvedValue(mockCategory);

            const result = await service.findOne(mockId);

            expect(result).toEqual(mockCategory);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: expect.any(ObjectId) }
            });
        });
    });

})
