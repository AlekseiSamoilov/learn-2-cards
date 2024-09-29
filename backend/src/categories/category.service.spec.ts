import { Repository } from "typeorm";
import { CategoriesService } from "./categories.service"
import { Category } from "./category.entity";
import { find } from "rxjs";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

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
    })
})
