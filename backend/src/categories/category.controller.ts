import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) { }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }
}