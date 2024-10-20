import { MongooseModule } from "@nestjs/mongoose";
import { Card, CardSchema } from "./card.schema";
import { CardController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }])
    ],
    controllers: [CardController],
    providers: [CardsService],
    exports: [CardsService],
})

export class CardsModule { }