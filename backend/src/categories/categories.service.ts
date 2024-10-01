import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ObjectId } from "mongodb";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const newCategory = await this.categoryRepository.save(createCategoryDto);
            return newCategory;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create new category: ${error.message}`)
        }
    }

    async findAll(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find();
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

    async findByNameAndUserId(name: string, userId: string): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOne({ where: { name, userId: new ObjectId(userId) } });
            if (!category) {
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

    async findAllByUserId(userId: string): Promise<Category[]> {
        try {
            return this.categoryRepository.find({ where: { userId: new ObjectId(userId) } })
        } catch (error) {
            throw new InternalServerErrorException(`Failed to found categories for user ${error.message}`)
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        try {
            const category = await this.findOne(id);
            Object.assign(category, updateCategoryDto)
            return this.categoryRepository.save(category);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to update category ${error.message}`);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.categoryRepository.delete(new ObjectId(id));
            if (result.affected === 0) {
                throw new NotFoundException(`Category with id ${id} not found`)
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to delete category ${error.message}`)
        }
    }

}