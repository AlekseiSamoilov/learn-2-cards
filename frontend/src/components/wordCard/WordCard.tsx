import React, { useState } from 'react'
import styles from './word-card.module.css'
import Input from '../input/Input';
import Button from '../button/Button';
import { motion } from 'framer-motion';
import AddWordForm from '../add-word-form/AddWordForm';

interface IWordCardProps {
    frontside: string;
    backside: string;
    onDelete: () => void;
    onEdit?: (frontside: string, backside: string, hintImageUrl: string) => void;
    isEditing: boolean;
    hintImageUrl: string;
}

const WordCard: React.FC<IWordCardProps> = ({ frontside, backside, onDelete, onEdit, isEditing, hintImageUrl }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedFrontside, setEditedFrontside] = useState(frontside);
    const [editedBackside, setEditedBackside] = useState(backside);
    const [editedHintImageUrl, setEditHintImageUrl] = useState(hintImageUrl);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isImageLoading, setIsImageLoading] = useState<boolean>(true);


    if (!onEdit) {
        return (
            <div>
                Редактировать здесь нечего
            </div>)
    }

    const handleImageLoad = () => {
        setIsImageLoading(false);
    }

    const handleEdit = (frontside: string, backside: string, hintImageUrl: string) => {
        onEdit(frontside, backside, hintImageUrl);
        setIsEditMode(false);
    }

    if (isEditMode) {
        return (
            <motion.div
                className={styles.container}
                initial={{ height: 'auto' }}
                animate={{ height: 'auto' }}
                exit={{ height: 'auto' }}
            >
                <AddWordForm
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditMode(false)}
                    initialValues={{
                        frontside,
                        backside,
                        hintImageUrl: hintImageUrl || ''
                    }}
                    isEditing={true} />
            </motion.div>
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.word_container}>
                <span>{frontside} - {backside}</span>
                <img className={styles.hint} src={hintImageUrl} />
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
