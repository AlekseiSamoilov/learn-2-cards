import { Repository } from "typeorm";
import { CategoriesService } from "./categories.service"
import { Category } from "./category.entity";
import { find } from "rxjs";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { create } from "domain";
import { InternalServerErrorException } from "@nestjs/common";

describe('CategoriesService', () => {
    let service: CategoriesService;
    let repo: Repository<Category>

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByNameAndUserId: jest.fn(),
        findAllByUserId: jest.fn(),
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
        })
    })

})
