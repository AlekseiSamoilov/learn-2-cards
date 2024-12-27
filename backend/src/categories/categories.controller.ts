import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-categoty.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
        const result = await this.categoryService.create(createCategoryDto, req.user.id);

        if (!req.user || !req.user.id) {
            throw new Error('User not auth');
        };

        return result;
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req) {
        return this.categoryService.findAllByUserId(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Get(':name/:userId')
    @UseGuards(JwtAuthGuard)
    findByNameAndUserId(@Param('name') name: string, userId: string) {
        return this.categoryService.findByTitleAndUserId(name, userId);
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