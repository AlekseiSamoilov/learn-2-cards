// import FeatureCard from '../../feature-card/FeatureCard';
// import UseCaseCard from '../../use-case-card/UseCaseCard';
// import styles from './landing-page.module.css';
import { Brain, BookOpen, Package, BookCheck, Sparkles } from 'lucide-react';

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import styles from './landing-page.module.css'

interface iFloatingCardProps {
    children: ReactNode
}
const FloatingCard: React.FC<iFloatingCardProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{
                y: [0, -10, 0],
                rotate: [-1, 1, -1],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        >
            {children}
        </motion.div>
    )
}

const ParticleEffect = () => {
    return (
        <div className={styles.particile_container}>
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className={styles.particle}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: -20,
                        scale: 0
                    }}
                    animate={{
                        y: window.innerHeight + 20,
                        scale: [0, 1, 0],
                        x: `calc(${Math.random() * 100}vh)`
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    )
}

const LandingPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);

    const navigateTo = (path: string) => {
        window.location.href = path;
    };

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = window.scrollY / totalScroll;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e: any) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const features = [
        {
            icon: <Brain className={styles.feature_icon} />,
            title: "Эффективное обучение",
            description: "Используйте силу активного запоминания"
        },
        {
            icon: <BookOpen className={styles.feature_icon} />,
            title: "Персонализация",
            description: "Создавайте собственные категории"
        },
        {
            icon: <Package className={styles.feature_icon} />,
            title: "Удобный интерфейс",
            description: "Интуитивно понятный дизайн"
        },
        {
            icon: <BookCheck className={styles.feature_icon} />,
            title: "Отслеживание прогресса",
            description: "Анализируйте свой прогресс"
        }
    ];

    return (
        <div className={styles.container} onMouseMove={handleMouseMove}>
            {/* <ParticleEffect /> */}

            <div className={styles.grid_pattern} />

            <nav className={styles.navbar}>
                <div className={styles.nav_content}>
                    <motion.div
                        className={styles.logo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Листай <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай
                    </motion.div>
                    <FloatingCard>
                        <motion.button
                            className={styles.start_button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { navigateTo('/login') }}
                        >
                            Начать
                        </motion.button>
                    </FloatingCard>
                </div>
            </nav>

            <main className={styles.main}>
                <section className={styles.hero_section}>
                    <motion.div
                        style={{
                            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`
                        }}
                        className={styles.hero_content}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.hero_title}
                        >
                            Изучайте эффективно
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={styles.hero_text}
                        >
                            Используйте силу карточек для запоминания и интервального повторения
                        </motion.p>
                    </motion.div>

                    <div className={styles.features_grid}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotate: [-1, 1],
                                    transition: { rotate: { duration: 0.2, repeat: Infinity, repeatType: "mirror" } }
                                }}
                                className={styles.feature_card}
                            >
                                <motion.div>
                                    {feature.icon}
                                </motion.div>
                                <h3 className={styles.feature_title}>
                                    {feature.title}
                                </h3>
                                <p className={styles.feature_description}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className={styles.cta_section}>
                    <div className={styles.cta_content}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={styles.cta_wrapper}
                        >
                            <h2 className={styles.cta_title}>
                                Начните прямо сейчас
                            </h2>
                            <FloatingCard>
                                <motion.button
                                    className={styles.cta_button}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { navigateTo('/register') }}
                                >
                                    Создать аккаунт
                                </motion.button>
                            </FloatingCard>
                        </motion.div>
                    </div>
                </section>
                <motion.div
                    className={styles.progress_bar}
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </main>
        </div>
    );
};

export default LandingPage;
