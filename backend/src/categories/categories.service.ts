import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { InternalServerErrorException } from "@nestjs/common";

export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const newCategory = this.categoryRepository.save(createCategoryDto);
            return newCategory;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create new category: ${error.message}`)
        }
    }
}