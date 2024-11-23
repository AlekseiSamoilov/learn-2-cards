import React, { useState } from 'react'
import styles from './review-page.module.css'
import Button from '../../button/Button';

interface ICard {
    id: string;
    frontside: string;
    backside: string;
    totalShows: number;
    correctAnswers: number;
}

const ReviewPage = () => {
    // const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [cards, setCards] = useState<ICard[]>([
        {
            id: '123',
            frontside: 'Hello',
            backside: 'World',
            totalShows: 2,
            correctAnswers: 2,
        }]);

    const handleFlip = () => {
        console.log('fliped called')
        setIsFlipped(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Слова</h1>
                <div className={styles.progress}>{currentCardIndex + 1} из {cards.length} </div>
            </div>
            <div className={styles.card}>
                {!isFlipped ? (
                    <>
                        <div className={styles.front_side}>{cards[currentCardIndex].frontside}</div>
                        <div className={styles.buttons}>
                            <Button onClick={handleFlip} text='Перевернуть!' width='150px' />
                            <Button text='Подсказка' width='150px' />
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.back_side}>{cards[currentCardIndex].backside}</div>
                        <div className={styles.buttons}>
                            <Button text='Правльно' width='150px' />
                            <Button text='Неправльно' width='150px' />
                        </div>
                    </>
                )}
            </div>
            <Button text='Назад к списку' width='300px' />
        </div>
    )
}

export default ReviewPage
