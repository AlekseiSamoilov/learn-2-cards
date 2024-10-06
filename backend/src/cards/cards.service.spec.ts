import { Repository } from "typeorm";
import { CardsService } from "./cards.service"
import { Card } from "./card.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateCardDto } from "./dto/create-card.dto";
import { ObjectId } from "mongodb";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";

describe('CardsService', () => {
    let service: CardsService;
    let repo: Repository<Card>

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardsService,
                {
                    provide: getRepositoryToken(Card),
                    useValue: mockRepository,
                }
            ],
        }).compile();

        service = module.get<CardsService>(CardsService);
        repo = module.get<Repository<Card>>(getRepositoryToken(Card));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createCardDto: CreateCardDto = {
            frontSide: 'Its frontside',
            backSide: 'Its backside',
            categoryId: new ObjectId(),
            userId: new ObjectId(),
        }
        it('should create a new card', async () => {

            const mockSavedCard = {
                id: 'testId',
                frontSide: createCardDto.frontSide,
            };

            mockRepository.save.mockResolvedValue(mockSavedCard);

            const result = await service.create(createCardDto);

            expect(result).toEqual(expect.objectContaining({
                id: 'testId',
                frontSide: createCardDto.frontSide,
            }));

            expect(mockRepository.save).toHaveBeenCalledWith(createCardDto)
        });

        it('should throw InternalServerExceptionError if save fails', async () => {

            mockRepository.save.mockRejectedValue(new Error('Database error'));

            await expect(service.create(createCardDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return an array if cards', async () => {
            const mockCards = [
                { id: new ObjectId(), frontSide: 'frontside1' },
                { id: new ObjectId(), frontSide: 'frontside2' },
                { id: new ObjectId(), frontSide: 'frontside3' }
            ];

            mockRepository.find.mockResolvedValue(mockCards);

            const result = await service.findAll();
            expect(result).toEqual(mockCards);
            expect(mockRepository.find).toHaveBeenCalled();
        });

        it('should throw InternalServerException if find fails', async () => {
            mockRepository.find.mockRejectedValue(new Error('Database Error'));

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return one card by id', async () => {
            const mockCard = {
                id: new ObjectId(),
                frontSide: 'frontside',
                backSide: 'backside',
                userId: new ObjectId(),
                categoryId: new ObjectId(),
            };

            mockRepository.findOne.mockResolvedValue(mockCard);

            const result = await service.findOne(mockCard.id.toHexString());

            expect(result).toEqual(mockCard);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: expect.any(ObjectId) }
            });
        });
        it('should throw NotFoundException if card not found by id', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(new ObjectId().toHexString())).rejects.toThrow(NotFoundException)
        });

        it('should throw InternalServerErrorException if find fails', async () => {
            const mockCardId = new ObjectId().toHexString();

            mockRepository.findOne.mockRejectedValue(new Error('Database error'));

            await expect(service.findOne(mockCardId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllByUserId', () => {
        const mockUserId = new ObjectId().toHexString();

        it('should return all cards by user id', async () => {
            const mockCards = [
                { id: new ObjectId().toHexString(), frontSide: 'frontside1', userId: new ObjectId().toHexString() },
                { id: new ObjectId().toHexString(), frontSide: 'frontside2', userId: new ObjectId().toHexString() }
            ];

            mockRepository.find.mockResolvedValue(mockCards);

            const result = await service.findAllByUserId(mockUserId);

            expect(result).toEqual(mockCards);
            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { userId: expect.any(ObjectId) }
            });
        });

        it('should throw InternalServerErrorException if find fails', async () => {
            mockRepository.find.mockRejectedValue(new Error('Database Error'));

            await expect(service.findAllByUserId(mockUserId)).rejects.toThrow(InternalServerErrorException);
        });
    })

    describe('findOneByUserId', () => {
        const mockUserId = new ObjectId();

        const mockCard = {
            id: new ObjectId(),
            frontSide: 'frontside',
            backSide: 'backside',
            userId: mockUserId,
            categoryId: new ObjectId(),
        };
        it('should return one card by user id', async () => {
            mockRepository.findOne.mockResolvedValue(mockCard);

            const result = await service.findOneByUserId(mockUserId.toHexString(), mockCard.id.toHexString());

            expect(result).toEqual(mockCard);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: {
                    userId: mockUserId,
                    id: mockCard.id,
                }
            });
        });

        it('should throw NotFoundException if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOneByUserId(mockUserId.toHexString(), mockCard.id.toHexString())).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerExceptionError if find fails', async () => {
            mockRepository.findOne.mockRejectedValue(new Error('Database error'));

            await expect(service.findOneByUserId(mockUserId.toHexString(), mockCard.id.toHexString())).rejects.toThrow(InternalServerErrorException)
        });
    });

    describe('update', () => {
        const mockCard = {
            id: new ObjectId(),
            frontSide: 'frontside',
            backSide: 'backside',
            userId: new ObjectId(),
            categoryId: new ObjectId(),
            createdAt: new Date,
            updatedAt: new Date,
            totalShows: 5,
            correctAnswers: 2,
        }

        const updatedCardDto = {
            frontSide: 'anotherFrontside',
        }

        it('should update a card', async () => {
            const upgratedCard = { ...mockCard, ...updatedCardDto };

            jest.spyOn(service, 'findOne').mockResolvedValue(mockCard);
            mockRepository.save.mockResolvedValue(upgratedCard);

            const result = await service.update(mockCard.id.toHexString(), updatedCardDto);

            expect(result).toEqual(upgratedCard);
        })
    })

})
