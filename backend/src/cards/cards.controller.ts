import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

@Controller('cards')
export class CardController {
    constructor(private readonly cardService: CardsService) { }

    @Post()
    create(@Body() createCardDto: CreateCardDto) {
        return this.cardService.create(createCardDto);
    }

    @Get()
    findAll() {
        return this.cardService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cardService.findOne(id);
    }

    @Get(':userId')
    findAllByUserId(@Param('userId') userId: string) {
        return this.cardService.findAllByUserId(userId);
    }

    @Get(':userId/:id')
    findOneByUserId(@Param('userId') userId: string, id: string) {
        return this.cardService.findOneByUserId(userId, id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
        return this.cardService.update(id, updateCardDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cardService.remove(id);
    }
}