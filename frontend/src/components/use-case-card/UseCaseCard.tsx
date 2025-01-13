import React from 'react'
import styles from './use-case-card.module.css'

interface IUseCaseProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const UseCaseCard: React.FC<IUseCaseProps> = ({ icon, title, description }) => {
    return (
        <div className={styles.use_case_card}>
            <div className={styles.use_case_icon}>{icon}</div>
            <div>
                <h3 className={styles.feature_title}>{title}</h3>
                <p className={styles.feature_description}>{description}</p>
            </div>
        </div>
    )
}

export default UseCaseCard
