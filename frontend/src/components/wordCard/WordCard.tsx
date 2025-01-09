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
            layout>
            <AnimatePresence mode='wait'>
                <motion.div className={styles.word_container} layout>
                    <div className={styles.card_box}>
                        {imageUrl && !isExpanded && (
                            <div className={styles.hint_pic}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136v-39.9l138.5-164.3 150.1 178L658.1 489 888 761.6V792zm0-129.8L664.2 396.8c-3.2-3.8-9-3.8-12.2 0L424.6 666.4l-144-170.7c-3.2-3.8-9-3.8-12.2 0L136 652.7V232h752v430.2zM304 456a88 88 0 1 0 0-176 88 88 0 0 0 0 176zm0-116c15.5 0 28 12.5 28 28s-12.5 28-28 28-28-12.5-28-28 12.5-28 28-28z"></path></svg></div>
                        )}
                        <div className={styles.word}><span className={styles.frontside}>{frontside}</span> ➛ <span className={styles.backside}>{backside}</span></div>
                        <p className={styles.statistic}>Правльных ответов: 12/23</p>
                        {/* <p className={styles.statistic}>Правльных ответов: 33</p> */}
                    </div>
                    {isExpanded && imageUrl && (
                        <motion.div
                            className={styles.hint_container}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: isEditing ? 0 : 20 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <button className={styles.edit_button} onClick={(e) => { e.stopPropagation(); setIsEditMode(true) }}>✎</button>
                        <button className={styles.delete_button} onClick={(e) => { e.stopPropagation(); onDelete() }}>✖</button>
                    </motion.div>
                )
            }
        </motion.div >
    );
};

export default WordCard
