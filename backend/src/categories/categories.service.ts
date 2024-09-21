import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { ObjectId, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";

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

    async findAll(): Promise<Category[]> {
        try {
            return this.categoryRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find categories ${error.message}`);
        }
    }

    async findOne(id: string): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { id: new ObjectId(id) } });
            if (!category) {
                throw new NotFoundException(`Category with id ${id} not found`);
            }
            return category;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to find category ${error.message}`)
        }
    }

    async findByName(name: string): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { name: name } });
            if (!name) {
                throw new NotFoundException(`Category with ${name} not found`)
            }
            return category;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to find category by name ${error.message}`);
        }
    }
}