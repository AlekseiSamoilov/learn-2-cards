import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Card } from "./card.entity";
import { Repository } from "typeorm";
import { CreateCardDto } from "./dto/create-card.dto";
import { ObjectId } from "mongodb";
import { UpdateCardDto } from "./dto/update-card.dto";

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>
    ) { }

    async create(createCardDto: CreateCardDto): Promise<Card> {
        try {
            const newCard = await this.cardRepository.save(createCardDto);
            return newCard;
        } catch (error) {
            throw new InternalServerErrorException(`Failed to create new card: ${error.message}`);
        }
    }

    async findAll(): Promise<Card[]> {
        try {
            return await this.cardRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find cards: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<Card> {
        try {
            const card = await this.cardRepository.findOne({ where: { id: new ObjectId(id) } });
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

    async findAllByUserId(userId: string): Promise<Card[]> {
        try {
            return await this.cardRepository.find({ where: { userId: new ObjectId(userId) } });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to find cards for user ${userId}: ${error.message}`);
        }
    }

    async findOneByUserId(userId: string, id: string): Promise<Card> {
        try {
            const card = await this.cardRepository.findOne({ where: { userId: new ObjectId(userId), id: new ObjectId(id) } });
            if (!card) {
                throw new NotFoundException(`Card with id: ${id} for user ${userId} was not find`);
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
            const card = await this.cardRepository.findOne({ where: { id: new ObjectId(id) } });
            if (!card) {
                throw new NotFoundException(`Card with id ${id} not found`);
            }
            Object.assign(card, updateCardDto)
            return await this.cardRepository.save(card)
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`Failed to update card ${error.message}`);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.cardRepository.delete(new ObjectId(id));
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
}