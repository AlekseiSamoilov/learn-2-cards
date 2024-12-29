import React, { useEffect, useMemo, useState } from 'react'
import styles from './review-page.module.css'
import Button from '../../button/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { isCookie, useLocation, useNavigate, useParams } from 'react-router-dom';
import CardSelectionService from '../../../api/services/cardsSelection.service';
import { cardService } from '../../../api/services/card.service';

interface ICard {
    _id: string;
    frontside: string;
    backside: string;
    totalShows: number;
    correctAnswers: number;
    hintImageUrl?: string;
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
    const { cards: initialCards, cardsToReview } = location.state || { cards: [], cardsToReview: 0 };
    const [cards, setCards] = useState<ICard[]>(initialCards);
    const [studyStats, setStudyStats] = useState<{
        totalAnswers: number;
        correctAnswers: number;
    }>({ totalAnswers: 0, correctAnswers: 0 });

    const cardSelectionService = useMemo(() => new CardSelectionService(), []);

    console.log('Initial cards:', initialCards); // Добавьте для отладки

    const selectNextCards = () => {
        const availableCards = cards.filter(card => !reviewedCards.has(card._id));

        if (reviewedCards.size >= cardsToReview || availableCards.length === 0) {
            navigate('/result', {
                state: {
                    stats: {
                        totalAnswers: studyStats.totalAnswers,
                        correctAnswers: studyStats.correctAnswers,
                        successRate: (studyStats.correctAnswers / studyStats.totalAnswers) * 100
                    }
                }
            });
            return;
        }
        const nextCards = cardSelectionService.getNextCard(availableCards);
        setCurrentCard(nextCards);
        setIsFlipped(false);
        setShowHint(false);
    }



    useEffect(() => {
        if (!location.state || !cards.length) {
            navigate('/main');
            return;
        }
        selectNextCards();
    }, []);

    const handleAnswer = async (isCorrect: boolean) => {
        if (!currentCard) return;

        try {
            if (isCorrect) {
                await cardService.incrementCorrectAnswers(currentCard._id);
            } else {
                await cardService.incrementTotalShows(currentCard._id);
            }

            const updatedCards = cards.map(card => card._id === currentCard._id ? {
                ...card,
                totalShows: card.totalShows + 1,
                correctAnswers: isCorrect ? card.correctAnswers + 1 : card.correctAnswers
            } : card);
            setCards(updatedCards);

            setStudyStats(prev => ({
                totalAnswers: prev.totalAnswers + 1,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers
            }));

            setReviewedCards(prev => new Set(prev).add(currentCard._id));
            selectNextCards();
        } catch (error) {
            console.error('Failed to update card statistics: error');
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
                <h1 className={styles.title}>{name}</h1>
                <div className={styles.progress}>{reviewedCards.size} из {cards.length}</div>
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
                                    src={currentCard.hintImageUrl}
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
                                    <Button onClick={() => handleAnswer(true)} text='Правильно' width='medium' />
                                    <Button onClick={() => handleAnswer(false)} text='Неправильно' width='medium' />
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
                                <Button onClick={handleFlip} text='Показать ответ' width='medium' />
                                <Button onClick={toggleHint} text='Подсказка' width='medium' />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div >
            <Button onClick={handleBackToList} text='Назад к списку' width='large' />
        </div >
    )
}

export default ReviewPage
