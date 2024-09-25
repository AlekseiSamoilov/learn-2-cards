import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoriesController } from "./category.controller";
import { CategoriesService } from "./categories.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})

export class CategoriesModule { }