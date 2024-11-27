import React, { useState } from 'react'
import styles from './word-card.module.css'
import Input from '../input/Input';

interface IWordCardProps {
    frontside: string;
    backside: string;
    onDelete: () => void;
    onEdit?: (frontside: string, backside: string) => void;
    isEditing: boolean;
    hintImageUrl?: string;
    isEditin: boolean;
}

const WordCard: React.FC<IWordCardProps> = ({ frontside, backside, onDelete, onEdit, isEditing, hintImageUrl }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedFrontside, setEditedFrontside] = useState(frontside);
    const [editedBackside, setEditedBackside] = useState(backside);


    if (!onEdit) {
        return (
            <div>
                Редактировать здесь нечего
            </div>)
    }
    const handleSave = () => {
        onEdit(editedFrontside, editedBackside);
        setIsEditMode(false);
    }

    if (isEditMode) {
        return (
            <div className={styles.container}>
                <Input
                    title='Редактировать лицевую сторону'
                    value={editedFrontside}
                    onChange={(e) => setEditedFrontside(e.target.value)}
                    placeholder="Слово"
                />
                <Input
                    title='Редактировать обратную сторону'
                    value={editedBackside}
                    onChange={(e) => setEditedBackside(e.target.value)}
                    placeholder="Перевод"
                />
                <div className={styles.buttons}>
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={() => setIsEditMode(false)}>Отмена</button>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.word_container}>
                <span>{frontside} - {backside}</span>
                <img src={hintImageUrl} />
            </div>
            {isEditing && (
                <div className={styles.word_action}>
                    <button className={styles.edit_button} onClick={() => setIsEditMode(true)}>✎</button>
                    <button className={styles.delete_button} onClick={onDelete}>✖</button>
                </div>
            )}
        </div>
    );
};

export default WordCard
