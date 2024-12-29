import React from 'react'
import styles from './result-page.module.css'
import Button from '../../button/Button'
import { useLocation, useNavigate } from 'react-router-dom'

interface ICardStats {
    difficulty: number;
    successRate: number;
    needMorePractice: boolean;
}

const ResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stats = location.state?.stats as ICardStats[] || [];

    const avetageSuccessRate = stats.reduce((acc, stat) => acc + stat.successRate, 0) / stats.length;
    const cardsNeedingPractice = stats.filter(stat => stat.needMorePractice).length;

    const getEncouragement = (rate: number): string => {
        if (rate >= 90) return "Отлично! Вы великолепно справляетесь!";
        if (rate >= 70) return "Хороший результат! Так держат!";
        if (rate >= 50) return "Неплохо! Есть куда расти!";
        return "Продолжайте практиковатьсяб у вас всё получится!";
    };

    const goToBegin = () => {
        navigate('/main')
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Результаты</h1>
            <div className={styles.result_container}>
                <h2 className={styles.result}>
                    Средний процент правильных ответов: {avetageSuccessRate.toFixed(1)}%
                </h2>
                <h3 className={styles.summary}>
                    {getEncouragement(avetageSuccessRate)}
                </h3>
                {cardsNeedingPractice > 0 && (
                    <p className={styles.practice_note}>{cardsNeedingPractice} карточек требуют дополнительной практики</p>
                )}
            </div>
            <Button onClick={goToBegin} width='large' text='К категориям' />
        </div>
    )
}

export default ResultPage
