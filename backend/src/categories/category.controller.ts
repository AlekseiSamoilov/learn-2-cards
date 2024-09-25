import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateCategoryDto } from "./dto/update-category.dto";

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

    @Get(':name/:userId')
    @UseGuards(JwtAuthGuard)
    findByNameAndUserId(@Param('name') name: string, userId: string) {
        return this.categoryService.findByNameAndUserId(name, userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findAllByUserId(@Param('id') id: string) {
        return this.categoryService.findAllByUserId(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}