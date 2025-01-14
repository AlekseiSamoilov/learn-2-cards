import { ICard } from "../types/card.types";

class CardSelectionService {
    private readonly MIN_SHOWS_THRESHOLD = 5;
    private readonly DEFAULT_DIFFICULT = 0.5;

    // Рассчет сложности карточки
    private calculateDifficult(card: ICard): number {
        if (card.totalShows < this.MIN_SHOWS_THRESHOLD) {
            return this.DEFAULT_DIFFICULT;
        }
        return card.correctAnswers / card.totalShows;
    }

    // Группировка карточек по сложости
    private groupCardsByDifficulty(cards: ICard[]): {
        hard: ICard[];
        medium: ICard[];
        easy: ICard[];
        new: ICard[];
    } {
        return cards.reduce((acc, card) => {
            if (card.totalShows < this.MIN_SHOWS_THRESHOLD) {
                acc.new.push(card);
            } else {
                const difficulty = this.calculateDifficult(card);
                if (difficulty < 0.3) {
                    acc.hard.push(card);
                } else if (difficulty < 0.7) {
                    acc.medium.push(card);
                } else {
                    acc.easy.push(card);
                }
            }
            return acc;
        }, {
            hard: [] as ICard[],
            medium: [] as ICard[],
            easy: [] as ICard[],
            new: [] as ICard[],
        });
    }

    // Случайное перемешивание массива 
    private shuffleArray(array: ICard[]): ICard[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private getRandomCard(cards: ICard[]): ICard | null {
        if (cards.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * cards.length);
        return cards[randomIndex]
    }

    //Метод для получения случайной карточки
    public selectNextCard(groupedCards: {
        hard: ICard[];
        medium: ICard[];
        easy: ICard[];
        new: ICard[];
    }): ICard | null {

        let cardPool: ICard[] = [];

        if (groupedCards.hard.length > 0) {
            cardPool.push(...this.shuffleArray(groupedCards.hard));
            cardPool.push(...this.shuffleArray(groupedCards.hard));
        }

        if (groupedCards.medium.length > 0) {
            cardPool.push(...this.shuffleArray(groupedCards.medium));
        }

        if (groupedCards.easy.length > 0) {
            cardPool.push(...this.shuffleArray(groupedCards.easy));
        }

        if (groupedCards.new.length > 0) {
            const shuffledNew = this.shuffleArray(groupedCards.new);

            const halfPoint = Math.floor(cardPool.length / 2);
            cardPool.splice(halfPoint, 0, ...shuffledNew);
        }

        return this.getRandomCard(cardPool);
    }

    public getNextCard(cards: ICard[]): ICard | null {
        if (cards.length === 0) return null;

        const groupedCards = this.groupCardsByDifficulty(cards);
        return this.selectNextCard(groupedCards);
    }

    //Метод для получения статистики 
    public getCardsStats(card: ICard): {
        difficulty: number;
        successRate: number;
        needsMorePractice: boolean;
    } {
        const difficulty = this.calculateDifficult(card);
        return {
            difficulty,
            successRate: card.totalShows > 0 ? (card.correctAnswers / card.totalShows) * 100 : 0,
            needsMorePractice: difficulty < 0.7
        };
    }
}

export default CardSelectionService;