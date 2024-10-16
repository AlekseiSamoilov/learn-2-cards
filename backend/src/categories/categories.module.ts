import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "./category.schema";
import { Category } from './category.schema'
import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})

export class CategoryModule { }