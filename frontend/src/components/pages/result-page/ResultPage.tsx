import styles from './result-page.module.css'
import Button from '../../button/Button'
import { useLocation, useNavigate } from 'react-router-dom'

const ResultPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stats = location.state?.stats || { totalAnswers: 0, correctAnswers: 0, successRate: 0 };

    const getEncouragement = (rate: number) => {
        if (rate >= 90) return { message: "Отлично! Вы великолепно справляетесь!", style: styles.excellent };
        if (rate >= 70) return { message: "Хороший результат! Так держать!", style: styles.good };
        if (rate >= 50) return { message: "Неплохо! Есть куда расти!", style: styles.average };
        return { message: "Продолжайте практиковаться у вас всё получится!", style: styles.needPractice };
    };

    const encouragement = getEncouragement(stats.successRate);

    const goToBegin = () => {
        navigate('/main');
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Результаты</h1>
            <div className={`${styles.result_container} ${encouragement.style}`}>
                <h2 className={styles.result}>
                    Средний процент правильных ответов: {stats.successRate.toFixed(1)}%
                </h2>
                <h3 className={styles.summary}>
                    {encouragement.message}
                </h3>
                <p>Правльных ответов: {stats.correctAnswers} из {stats.totalAnswers}</p>
            </div>
            <Button onClick={goToBegin} width='large' text='К категориям' />
        </div>
    )
}

export default ResultPage
