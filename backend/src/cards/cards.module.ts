import { TypeOrmModule } from "@nestjs/typeorm";
import { Card } from "./card.entity";
import { CardController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([Card])],
    controllers: [CardController],
    providers: [CardsService],
    exports: [CardsService],
})

export class CardsModule { }