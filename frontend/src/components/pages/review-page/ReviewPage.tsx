import React, { useEffect, useMemo, useState } from 'react'
import styles from './review-page.module.css'
import Button from '../../button/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CardSelectionService from '../../../api/services/cardsSelection.service';
import { cardService } from '../../../api/services/card.service';

interface ICard {
    _id: string;
    frontside: string;
    backside: string;
    totalShows: number;
    correctAnswers: number;
    imageUrl?: string;
    categoryId: string;
}

const ReviewPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const { name } = useParams<{ name: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [currentCard, setCurrentCard] = useState<ICard | null>(null);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());
    const { cards: initialCards, cardsToRepeat = 0 } = location.state || {};
    const [cards, setCards] = useState<ICard[]>(initialCards.slice(0, cardsToRepeat));
    const [studyStats, setStudyStats] = useState<{
        totalAnswers: number;
        correctAnswers: number;
    }>({ totalAnswers: 0, correctAnswers: 0 });

    const cardSelectionService = useMemo(() => new CardSelectionService(), []);

    useEffect(() => {
        if (!cards.length) {
            navigate('/main');
            return;
        }

        if (!currentCard && cards.length > reviewedCards.size) {
            const availableCards = cards.filter(card => !reviewedCards.has(card._id));
            if (availableCards.length > 0) {
                const nextCards = cardSelectionService.getNextCard(availableCards);
                setCurrentCard(nextCards)
            }
        }
    }, [cards, reviewedCards, currentCard]);

    const handleAnswer = async (isCorrect: boolean) => {
        if (!currentCard) return;

        try {
            if (isCorrect) {
                await cardService.incrementCorrectAnswers(currentCard._id);
            } else {
                await cardService.incrementTotalShows(currentCard._id);
            }

            setStudyStats(prev => ({
                totalAnswers: prev.totalAnswers + 1,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
            }));

            setReviewedCards(prev => new Set(prev).add(currentCard._id));

            if (reviewedCards.size + 1 >= cardsToRepeat) {
                navigate('/result', {
                    state: {
                        stats: {
                            totalAnswers: studyStats.totalAnswers + 1,
                            correctAnswers: studyStats.correctAnswers + (isCorrect ? 1 : 0),
                            successRate: ((studyStats.correctAnswers + (isCorrect ? 1 : 0)) / (studyStats.totalAnswers + 1)) * 100
                        }
                    }
                });
                return;
            }

            const availableCards = cards.filter(card =>
                !reviewedCards.has(card._id) && card._id !== currentCard._id
            );

            if (availableCards.length > 0) {
                const nextCard = cardSelectionService.getNextCard(availableCards);
                setCurrentCard(nextCard);
                setIsFlipped(false);
                setShowHint(false);
            }
        } catch (error) {
            console.error('Failed to update card statistics:', error);
            throw error;
        }
    };

    if (!currentCard) return null;

    const handleFlip = () => {
        setIsFlipped(true);
        setShowHint(false)
    };

    const handleBackToList = () => {
        navigate(`/category/${categoryId}`)
    }

    const toggleHint = () => {
        setShowHint(prev => !prev);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{name}sdsd</h1>
                <div className={styles.progress}>{reviewedCards.size + 1} из {cardsToRepeat}</div>
                <button onClick={handleBackToList} className={styles.back_btn}></button>
            </div>
            <motion.div
                className={styles.card_container}
                key={currentCard._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, type: 'spring', bounce: 0.3 }}
            >
                <div className={styles.front_side}>
                    {currentCard.frontside}
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
                                    src={currentCard.imageUrl}
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
                                    {currentCard.backside}
                                </motion.div>
                                <motion.div
                                    className={styles.buttons}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring', bounce: 0.4 }}
                                >
                                    <Button onClick={() => handleAnswer(true)} text='Правильно' width='large' />
                                    <Button onClick={() => handleAnswer(false)} text='Неправильно' width='large' />
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
                                <Button onClick={handleFlip} text='Показать ответ' width='large' />
                                <Button onClick={toggleHint} text='Подсказка' width='large' />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div >
        </div >
    )
}

export default ReviewPage
