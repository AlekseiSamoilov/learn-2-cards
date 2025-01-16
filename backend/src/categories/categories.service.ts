import { Category } from "./category.schema";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<Category>) { }

    async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
        try {
            const newCategory = new this.categoryModel({
                ...createCategoryDto,
                userId: new Types.ObjectId(userId)
            });
            return newCategory.save();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create new category: ${error.message}`)
        }
    }

    async findAll(): Promise<Category[]> {
        try {
            return await this.categoryModel.find();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find categories ${error.message}`);
        }
    }

    async findOne(id: string): Promise<Category> {
        try {
            const category = await this.categoryModel.findById(id);
            if (!category) {
                throw new NotFoundException(`Category with id ${id} not found`);
            }
            return category;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to find category ${error.message}`)
        }
    }

    async findByTitleAndUserId(name: string, userId: string): Promise<Category> {
        try {
            const category = await this.categoryModel.findById(userId);
            if (!category) {
                throw new NotFoundException(`Category with ${name} was not found`)
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
            return await this.categoryModel.find({
                userId: new Types.ObjectId(userId)
            })
        } catch (error) {
            throw new InternalServerErrorException(`Failed to found categories for user ${error.message}`)
        }
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        try {
            const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, { ...updateCategoryDto, updatedAt: new Date() }, { new: true })
            if (!updatedCategory) {
                throw new NotFoundException(`Category with id ${id} not found`);
            }
            return updatedCategory
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to update category: ${error.message}`);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.categoryModel.deleteOne({ _id: id });
            if ((result as any).deletedCount === 0) {
                throw new NotFoundException(`Category with id ${id} not found`)
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to delete category: ${error.message}`)
        }
    }

}