import { CardsService } from "./cards.service"
import { Card } from "./card.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCardDto } from "./dto/create-card.dto";
import { ObjectId } from "mongodb";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";

describe('CardsService', () => {
    let service: CardsService;
    let model: Model<Card>

    const mockCardModel = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        deleteOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardsService,
                {
                    provide: getModelToken(Card.name),
                    useValue: mockCardModel,
                }
            ],
        }).compile();

        service = module.get<CardsService>(CardsService);
        model = module.get<Model<Card>>(getModelToken(Card.name));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const mockCategoryId = new Types.ObjectId().toHexString();
        const mockUserId = new Types.ObjectId().toHexString();
        const createCardDto: CreateCardDto = {
            frontside: 'Its frontside',
            backside: 'Its backside',
            categoryId: mockCategoryId,
        }
        it('should create a new card', async () => {

            const mockCreatedCard = {
                _id: new Types.ObjectId(),
                frontSide: createCardDto.frontside,
                backside: createCardDto.backside,
                categoryId: createCardDto.categoryId,
                save: jest.fn().mockResolvedValue({
                    _id: new Types.ObjectId(),
                    frontside: createCardDto.frontside,
                    backside: createCardDto.backside,
                    categoryId: createCardDto.categoryId,
                })

            };

            const mockCardModelConstructor = jest.fn(() => mockCreatedCard);
            (service as any).cardModel = mockCardModelConstructor;

            const result = await service.create(createCardDto, mockUserId, mockCategoryId);

            expect(result).toEqual(expect.objectContaining({
                _id: expect.any(Types.ObjectId),
                frontside: createCardDto.frontside,
                backside: createCardDto.backside
            }));

            expect(mockCreatedCard.save).toHaveBeenCalled();
        });

        it('should throw InternalServerExceptionError if save fails', async () => {

            mockCardModel.save.mockRejectedValue(new Error('Database error'));

            await expect(service.create(createCardDto, mockUserId, mockCategoryId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return an array if cards', async () => {
            const mockCards = [
                { id: new Types.ObjectId(), frontSide: 'frontside1' },
                { id: new Types.ObjectId(), frontSide: 'frontside2' },
                { id: new Types.ObjectId(), frontSide: 'frontside3' }
            ];

            mockCardModel.find.mockResolvedValue(mockCards);

            const result = await service.findAll();
            expect(result).toEqual(mockCards);
            expect(mockCardModel.find).toHaveBeenCalled();
        });

        it('should throw InternalServerException if find fails', async () => {
            mockCardModel.find.mockRejectedValue(new Error('Database Error'));

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return one card by id', async () => {
            const mockId = new Types.ObjectId();
            const mockCard = {
                _id: mockId,
                frontside: 'frontside',
                backside: 'backside',
                userId: new Types.ObjectId(),
                categoryId: new Types.ObjectId(),
            };

            mockCardModel.findById.mockResolvedValue(mockCard);

            const result = await service.findOne(mockId.toHexString());

            expect(result).toEqual(mockCard);
            expect(mockCardModel.findById).toHaveBeenCalledWith(mockCard._id.toHexString())
        });

        it('should throw NotFoundException if card not found by id', async () => {
            mockCardModel.findById.mockResolvedValue(null);

            await expect(service.findOne(new ObjectId().toHexString())).rejects.toThrow(NotFoundException)
        });

        it('should throw InternalServerErrorException if find fails', async () => {
            const mockCardId = new ObjectId().toHexString();

            mockCardModel.findById.mockRejectedValue(new Error('Database error'));

            await expect(service.findOne(mockCardId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        const mockCard = {
            _id: new Types.ObjectId(),
            frontside: 'frontside',
            backside: 'backside',
            userId: new Types.ObjectId(),
            categoryId: new Types.ObjectId(),
            createdAt: new Date,
            updatedAt: new Date,
            totalShows: 5,
            correctAnswers: 2,
            imageUrl: 'randomUrl'
        }

        const updatedCardDto = {
            frontside: 'anotherFrontside',
        }

        it('should update a card', async () => {
            const updatedCard = { ...mockCard, ...updatedCardDto };

            mockCardModel.findByIdAndUpdate.mockResolvedValue(updatedCard)

            const result = await service.update(mockCard._id.toHexString(), updatedCardDto);

            expect(result).toEqual(updatedCard);
        })
    })

})
