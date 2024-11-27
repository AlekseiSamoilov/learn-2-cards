import React from 'react'
import styles from './word-card.module.css'

interface IWordCardProps {
    frontside: string;
    backside: string;
    onDelete: () => void;
    onEdit?: () => void;
    isEditing: boolean;
    hintImageUrl?: string;
}

const WordCard: React.FC<IWordCardProps> = ({ frontside, backside, onDelete, onEdit, isEditing, hintImageUrl }) => {
    return (
        <div className={styles.container}>
            <div className={styles.word_container}>
                <span>{frontside} - {backside}</span>
                <img src={hintImageUrl} />
            </div>
            {isEditing && (
                <div className={styles.word_action}>
                    <button className={styles.edit_button} onClick={onEdit}>✎</button>
                    <button className={styles.delete_button} onClick={onDelete}>✖</button>
                </div>
            )}
        </div>
    );
};

export default WordCard
