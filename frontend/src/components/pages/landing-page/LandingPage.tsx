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
                    <h1 className={styles.logo}>Листай <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай</h1>
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
                        description='Добавляйте изображения к карточкам для более эффективного запоминания материала'
                    />
                    <FeatureCard
                        icon={<BrainCircuit size={48} />}
                        title='Умное повторение'
                        description='Отслеживайте статистику правильных ответов и прогресс обучения для каждой карточки'
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
                        description='Эффективно запоминайте определения, формулы, даты и ключевые концепции с помощью визуальных подсказок'
                    />
                    <UseCaseCard
                        icon={<Languages size={32} />}
                        title='Любые области знаний'
                        description='От биологии до искусства - создавайте карточки для изучения любой темы, которая вас интересует'
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
