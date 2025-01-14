import { ICard } from "../types/card.types";
import CardSelectionService from "./cardsSelection.service"

describe('CardSelectionService', () => {
    let service: CardSelectionService;

    beforeEach(() => {
        service = new CardSelectionService();
    });

    describe('getCardsStats', () => {
        it('should calculate correct statistic for a card', () => {
            const card: ICard = {
                _id: '123123',
                frontside: 'test',
                backside: 'test',
                categoryId: '1',
                totalShows: 10,
                correctAnswers: 7,
            };

            const stats = service.getCardsStats(card);

            expect(stats.difficulty).toBe(0.7);
            expect(stats.successRate).toBe(70);
            expect(stats.needsMorePractice).toBe(false);
        });

        it('should handle cards with no shows', () => {
            const card: ICard = {
                _id: '123123',
                frontside: 'test',
                backside: 'test',
                categoryId: '1',
                totalShows: 0,
                correctAnswers: 0,
            };

            const stats = service.getCardsStats(card);

            expect(stats.difficulty).toBe(0.5);
            expect(stats.successRate).toBe(0);
            expect(stats.needsMorePractice).toBe(true);
        });
    });

    describe('getNextCard', () => {
        it('should return null for empty array', () => {
            const result = service.getNextCard([]);
            expect(result).toBeNull();
        });

        it('should prioritize hard cards', () => {
            const mockCards: ICard[] = [
                {
                    _id: '1',
                    frontside: 'hard',
                    backside: 'hard',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 2,
                },
                {
                    _id: '2',
                    frontside: 'easy',
                    backside: 'easy',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 82,
                }
            ];

            const selections = new Array(1000).fill(null)
                .map(() => service.getNextCard(mockCards));

            const hardSelections = selections.filter(card => card?.frontside === 'hard').length;

            expect(hardSelections).toBeGreaterThan(450);
            expect(hardSelections).toBeLessThan(650);
        });

        it('should include new cards in selections', () => {
            const mockCards: ICard[] = [
                {
                    _id: '1',
                    frontside: 'new',
                    backside: 'new',
                    categoryId: '1',
                    totalShows: 2,
                    correctAnswers: 1,
                },
                {
                    _id: '2',
                    frontside: 'hard',
                    backside: 'hard',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 2,
                }
            ];

            const selections = new Array(1000)
                .fill(null)
                .map(() => service.getNextCard(mockCards));

            const newCardSelections = selections.filter(card => card?.frontside === 'new').length;
            expect(newCardSelections).toBeGreaterThan(250);
            expect(newCardSelections).toBeLessThan(450);
        });

        it('should properly distribute cards of different difficulties', () => {
            const mockCards: ICard[] = [
                {
                    _id: '1',
                    frontside: 'hard',
                    backside: 'hard',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 2,
                },
                {
                    _id: '2',
                    frontside: 'medium',
                    backside: 'medium',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 5,
                },
                {
                    _id: '3',
                    frontside: 'easy',
                    backside: 'easy',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 8,
                }
            ];

            const selections = new Array(1000)
                .fill(null)
                .map(() => service.getNextCard(mockCards));

            const hardSelections = selections.filter(card => card?.frontside === 'hard').length;
            const mediumSelections = selections.filter(card => card?.frontside === 'medium').length;
            const easySelections = selections.filter(card => card?.frontside === 'easy').length;

            expect(hardSelections).toBeGreaterThan(450);
            expect(mediumSelections).toBeGreaterThan(250);
            expect(easySelections).toBeGreaterThan(150);

            expect(hardSelections + mediumSelections + easySelections).toBe(1000);
        });

        it('should not get stuck in a loop with the same card', () => {
            const mockCards: ICard[] = [
                {
                    _id: '1',
                    frontside: 'card1',
                    backside: 'card1',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 2,
                },
                {
                    _id: '2',
                    frontside: 'card2',
                    backside: 'card2',
                    categoryId: '1',
                    totalShows: 10,
                    correctAnswers: 2,
                }
            ];

            const selections = new Set(
                new Array(10)
                    .fill(null)
                    .map(() => service.getNextCard(mockCards)?.frontside)
            );

            expect(selections.size).toBeGreaterThan(1);
        });
    });
});
