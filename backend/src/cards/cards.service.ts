import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Card } from "./card.schema";
import { CreateCardDto } from "./dto/create-card.dto";
import { ObjectId } from "mongodb";
import { UpdateCardDto } from "./dto/update-card.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { find } from "rxjs";
import { Type } from "class-transformer";
import { Not } from "typeorm";

@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name)
        private cardModel: Model<Card>
    ) { }

    async create(createCardDto: CreateCardDto, userId: string, categoryId: string): Promise<Card> {
        try {
            const newCard = new this.cardModel({
                ...createCardDto,
                userId: new Types.ObjectId(userId),
                categoryId: new Types.ObjectId(categoryId)
            });
            return newCard.save();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create new card: ${error.message}`);
        }
    }

    async findAll(): Promise<Card[]> {
        try {
            return await this.cardModel.find();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find cards: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<Card> {
        try {
            const card = await this.cardModel.findById(id);
            if (!card) {
                throw new NotFoundException(`Card with id ${id} not found`);
            }
            return card;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to find card: ${error.message}`);
        }
    }

    async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
        try {
            const updatedCard = await this.cardModel.findByIdAndUpdate(id, { updateCardDto, updatedAt: new Date() }, { new: true });
            if (!updatedCard) {
                throw new NotFoundException(`Card with id ${id} not found`);
            }
            return updatedCard
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to update card ${error.message}`);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.cardModel.deleteOne({ _id: id });
            if ((result as any).deletedCount === 0) {
                throw new NotFoundException(`Card with id ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to remove card ${error.message}`);
        }
    }
    async findByCategory(categoryId: string): Promise<Card[]> {
        try {
            const findedCards = await this.cardModel.find({ categoryId: new Types.ObjectId(categoryId) });
            if (!findedCards) {
                throw new NotFoundException(`Cards in the category with id: ${categoryId}, not found`)
            }
            return findedCards
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to find cards: ${error.message}`);
        }
    }

    async incrementTotalShows(id: string): Promise<Card> {
        try {
            const updatedCard = await this.cardModel.findByIdAndUpdate(id, { $inc: { totalShows: 1 } }, { new: true });
            if (!updatedCard) {
                throw new NotFoundException(`Card wi id: ${id} not found`)
            }
            return updatedCard
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to update shows: ${error.message}`)
        }
    }

    async incrementCorrectAnswers(id: string): Promise<Card> {
        try {
            const updatedCard = await this.cardModel.findByIdAndUpdate(id, { $inc: { correctAnswers: 1, totalShows: 1 } }, { new: true });
            if (!updatedCard) {
                throw new NotFoundException(`Card with id: ${id} not found`);
            }
            return updatedCard
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to update card: ${error.message}`)
        }
    }

    async getRandomCard(categoryId: string): Promise<Card> {
        try {
            const cards = await this.cardModel.aggregate([
                { $match: { categoryId: new Types.ObjectId(categoryId) } },
                { $sample: { size: 1 } }
            ]);
            if (cards.length === 0) {
                throw new NotFoundException(`No cards found in category with id: ${categoryId}`)
            }
            return cards[0];
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error
            }
            throw new InternalServerErrorException(`Failed to get cards: ${error.message}`)
        }
    }
}