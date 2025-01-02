import React, { useState } from 'react'
import styles from './word-card.module.css'
import { AnimatePresence, motion } from 'framer-motion';
import AddWordForm from '../add-word-form/AddWordForm';

export interface IWordCardProps {
    frontside: string;
    backside: string;
    onDelete: () => void;
    onEdit?: (frontside: string, backside: string, imageUrl?: string) => void;
    isEditing: boolean;
    imageUrl?: string;
}

const WordCard: React.FC<IWordCardProps> = ({ frontside, backside, onDelete, onEdit, isEditing, imageUrl }) => {
    const [isEditMode, setIsEditMode] = useState(false);
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

    const handleEdit = (frontside: string, backside: string, imageUrl?: string) => {
        onEdit(frontside, backside, imageUrl);
        setIsEditMode(false);
        setIsExpanded(false)
    }

    if (isEditMode) {
        return (
            <motion.div
                className={styles.container}
                initial={false}
                exit={{ height: 'auto' }}
            >
                <AddWordForm
                    onSubmit={handleEdit}
                    onCancel={() => { setIsEditMode(false); setIsExpanded(false) }}
                    initialValues={{
                        frontside,
                        backside,
                        imageUrl: imageUrl || ''
                    }}
                    isEditing={true} />
            </motion.div>
        );
    }

    return (
        <motion.div className={`${styles.container} ${isExpanded ? styles.expended : ''}`}
            onClick={() => !isEditing && setIsExpanded(!isExpanded)}
            layout
        >
            <AnimatePresence mode='wait'>
                <motion.div className={styles.word_container} layout>
                    <span>{frontside} - {backside}</span>

                    {isExpanded && imageUrl && (
                        <motion.div
                            className={styles.hint_container}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isImageLoading && (
                                <div className={styles.loader}>
                                    Загрузка...
                                </div>
                            )}
                            <img
                                className={`${styles.hint} ${!isImageLoading ? styles.loaded : ''}`}
                                src={imageUrl}
                                alt='Подсказка'
                                loading='lazy'
                                onLoad={handleImageLoad}
                            />
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
            {
                isEditing && (
                    <motion.div className={styles.word_action} layout
                        initial={{ opacity: 0.5, scale: 0.8 }}
                        animate={{ opacity: 1, scale: isEditing ? 1.2 : 1 }}
                        transition={{ duration: 0.5 }}>
                        <button className={styles.edit_button} onClick={(e) => { e.stopPropagation(); setIsEditMode(true) }}>✎</button>
                        <button className={styles.delete_button} onClick={(e) => { e.stopPropagation(); onDelete() }}>✖</button>
                    </motion.div>
                )
            }
        </motion.div >
    );
};

export default WordCard
