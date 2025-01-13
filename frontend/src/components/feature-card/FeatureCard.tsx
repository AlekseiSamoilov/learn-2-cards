import React from 'react'
import styles from './feature-card.module.css'

interface IFeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<IFeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className={styles.feature_card}>
            <div className={styles.feature_icon}>{icon}</div>
            <h3 className={styles.feature_title}>{title}</h3>
            <p className={styles.feature_description}>{description}</p>
        </div>
    )
}

export default FeatureCard
