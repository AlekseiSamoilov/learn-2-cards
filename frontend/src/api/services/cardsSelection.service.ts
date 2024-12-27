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
    private groupCardsByDifficelty(cards: ICard[]): {
        hard: ICard[];
        medium: ICard[];
        easy: ICard[];
    } {
        return cards.reduce((acc, card) => {
            const difficulty = this.calculateDifficult(card);

            if (difficulty < 0.3) {
                acc.hard.push(card)
            } else if (difficulty < 0.7) {
                acc.medium.push(card);
            } else {
                acc.easy.push(card);
            }
            return acc;
        }, {
            hard: [] as ICard[],
            medium: [] as ICard[],
            easy: [] as ICard[],
        });
    }

    // Выбор случайной карточки
    private selectRandomCard(groupedCards: {
        hard: ICard[],
        medium: ICard[],
        easy: ICard[]
    }): ICard | null {
        const random = Math.random();
        let selectedGroup: ICard[];

        if (random < 0.5 && groupedCards.hard.length > 0) {
            selectedGroup = groupedCards.hard;
        } else if (random < 0.8 && groupedCards.medium.length > 0) {
            selectedGroup = groupedCards.medium;
        } else if (groupedCards.easy.length > 0) {
            selectedGroup = groupedCards.easy;
        } else {
            selectedGroup = groupedCards.hard.length > 0 ? groupedCards.hard :
                groupedCards.medium.length > 0 ? groupedCards.medium :
                    groupedCards.easy.length > 0 ? groupedCards.easy : [];
        }

        if (selectedGroup.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * selectedGroup.length);
        return selectedGroup[randomIndex];
    }


    //Метод для получения случайной карточки
    public getNextCard(cards: ICard[]): ICard | null {
        if (cards.length === 0) return null;

        const groupedCards = this.groupCardsByDifficelty(cards);
        return this.selectRandomCard(groupedCards);
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