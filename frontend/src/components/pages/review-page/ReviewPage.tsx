import React, { useState } from 'react'
import styles from './review-page.module.css'
import Button from '../../button/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ICard {
    id: string;
    frontside: string;
    backside: string;
    totalShows: number;
    correctAnswers: number;
    hintImageUrl?: string;
}

const ReviewPage = () => {
    // const [numberOfCards, setNumberOfCards] = useState<number>(0);
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [cards, setCards] = useState<ICard[]>([
        {
            id: '123',
            frontside: 'Hello',
            backside: 'World',
            totalShows: 2,
            correctAnswers: 2,
            hintImageUrl: 'https://images.pexels.com/photos/2466778/pexels-photo-2466778.jpeg'
        },
        {
            id: '124',
            frontside: 'Every',
            backside: 'Day',
            totalShows: 2,
            correctAnswers: 2,
            hintImageUrl: 'https://www.pexels.com/ru-ru/photo/2466778/'
        }]);

    const handleFlip = () => {
        setIsFlipped(true);
        setShowHint(false)
    };

    const handleNextCard = () => {
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    }

    const toggleHint = () => {
        setShowHint(prev => !prev);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Слова</h1>
                <div className={styles.progress}>{currentCardIndex + 1} из {cards.length}</div>
            </div>
            <motion.div
                className={styles.card_container}
                key={currentCardIndex}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, type: 'spring', bounce: 0.3 }}
            >
                <div className={styles.front_side}>
                    {cards[currentCardIndex].frontside}
                    <AnimatePresence>
                        {showHint && (
                            <motion.div
                                className={styles.hint_container}
                                initial={{ opacity: 0, y: 20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: 20, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <img
                                    src={cards[currentCardIndex].hintImageUrl}
                                    alt='Подсказка'
                                    className={styles.hint_image}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className={styles.answer_wrapper}>
                    <AnimatePresence mode="wait">
                        {isFlipped ? (
                            <motion.div
                                className={styles.answer_container}
                                initial={{ opacity: 0, y: -50, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -50, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring', bounce: 0.4 }}
                            >
                                <motion.div
                                    className={styles.back_side}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    {cards[currentCardIndex].backside}
                                </motion.div>
                                <motion.div
                                    className={styles.buttons}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring', bounce: 0.4 }}
                                >
                                    <Button onClick={handleNextCard} text='Правильно' width='150px' />
                                    <Button onClick={handleNextCard} text='Неправильно' width='150px' />
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="question"
                                className={styles.buttons}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
                            >
                                <Button onClick={handleFlip} text='Показать ответ' width='150px' />
                                <Button onClick={toggleHint} text='Подсказка' width='150px' />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div >
            <Button text='Назад к списку' width='300px' />
        </div >
    )
}

export default ReviewPage
