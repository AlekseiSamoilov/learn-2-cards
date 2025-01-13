import FeatureCard from '../../feature-card/FeatureCard';
import UseCaseCard from '../../use-case-card/UseCaseCard';
import styles from './landing-page.module.css';
import { Monitor, Image, BrainCircuit, Languages, School } from 'lucide-react';

const LandingPage = () => {
    const navigateTo = (path: string) => {
        window.location.href = path;
    }
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.hero_content}>
                    <h1 className={styles.title}>
                        Изучайте эффективнее с помощью интерактивных карточек
                    </h1>
                    <p className={styles.subtitle}>
                        Создавайте персонализированные карточки для запоминания с изображениями-подсказками и отслеживайте свой прогресс в обучении
                    </p>
                    <div className={styles.button_group}>
                        <button onClick={() => navigateTo('/register')} className={styles.primary_btn}>
                            Регистрация
                        </button>
                        <button onClick={() => navigateTo('/login')}
                            className={styles.secondary_btn}
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <h2 className={styles.section_title}>Особенности приложения</h2>
                <div className={styles.feature_grid}>
                    <FeatureCard
                        icon={<Monitor size={48} />}
                        title='Удобный веб-интерфейс'
                        description='Создавайте  и редактируйте карточки на компьютере для максимального удобства работы с изображениями'
                    />
                    <FeatureCard
                        icon={<Image size={48} />}
                        title='Визуальные подсказки'
                        description='Добавляйте изображения к карточкам для более жффективного запоминания материала'
                    />
                    <FeatureCard
                        icon={<BrainCircuit size={48} />}
                        title='Умное повторение'
                        description='Отслеживайте статистику правльных ответов и прогресс обучения для каждой карточки'
                    />
                </div>
            </section>
            <section className={`${styles.section} ${styles.section_dark}`}>
                <h2 className={styles.section_title}>Для чего можно использовать?</h2>
                <div className={styles.feature_grid}>
                    <UseCaseCard
                        icon={<Languages size={32} />}
                        title='Изучение языков'
                        description='Создавайте карточки для запоминания новых слов, фраз и грамматических правил. Добавляйте картинки для лучшей ассоциации'
                    />
                    <UseCaseCard
                        icon={<School size={32} />}
                        title='Подготовка к экзаменам'
                        description='Эффективно запоминайте определения. формулы, даты и ключевые концепции с помощью визуальных подсказок'
                    />
                    <UseCaseCard
                        icon={<Languages size={32} />}
                        title='Любые области знаний'
                        description='От биологии до искусства = создавайте карточки для изучения любой темы, которая вас интересует'
                    />
                </div>
            </section>
            <section className={styles.cta_section}>
                <h2 className={styles.title}>Начните учиться эффективнее уже сегодня</h2>
                <button
                    onClick={() => navigateTo('/register')}
                    className={styles.primary_btn}>
                    Создать аккаунт
                </button>
            </section>
        </div>
    )
}

export default LandingPage
