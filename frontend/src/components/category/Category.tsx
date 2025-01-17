import React from 'react'
import styles from './category.module.css'
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface ICategoryProps {
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    title: string;
    id: string;
    cardsCount: number;
}

const Category: React.FC<ICategoryProps> = ({ title, onDelete, onEdit, id, cardsCount }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/category/${id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(id)
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(id);
        }
    };

    return (
        <motion.div className={styles.container}>

            <motion.div className={styles.main_content} layout>
                <motion.div className={styles.info_container} onClick={handleClick}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.cards_count}>{`Карточек: ${cardsCount}`}</p>
                </motion.div>


            </motion.div>
            <AnimatePresence mode='wait'>
                {onDelete && (
                    <motion.div
                        key="edit-container"
                        className={styles.edit_container}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <button className={styles.delete_button}
                            onClick={handleEditClick}
                        >Изменить</button>
                        <button
                            className={styles.delete_button}
                            onClick={handleDeleteClick}
                        >Удалить</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div >
    )
}

export default Category
