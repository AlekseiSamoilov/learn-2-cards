import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardController {
    constructor(private readonly cardSerivce: CardsService) { }

    @Post(':categoryId')
    create(@Body() createCardDto: CreateCardDto, @Request() req, @Param('categoryId') categoryId: string) {
        return this.cardSerivce.create(createCardDto, req.user.userId, categoryId);
    }

    @Get()
    findAll() {
        return this.cardSerivce.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cardSerivce.findOne(id);
    }

    @Get('category/:categoryId')
    findByCategory(@Param('categoryId') categoryId: string) {
        return this.cardSerivce.findByCategory(categoryId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
        return this.cardSerivce.update(id, updateCardDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cardSerivce.remove(id);
    }

    @Patch(':id/shows')
    incrementTotalShows(@Param('id') id: string) {
        return this.cardSerivce.incrementTotalShows(id);
    }

    @Patch(':id/correct')
    incrementCorrectAnswers(@Param('id') id: string) {
        return this.cardSerivce.incrementTotalShows(id)
    }

    @Get('random/:categoryId')
    getRandomCard(@Param('categoryId') categoryId: string) {
        return this.cardSerivce.getRandomCard(categoryId);
    }

}