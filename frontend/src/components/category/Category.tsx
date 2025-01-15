import React, { useState } from 'react'
import styles from './category.module.css'
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../confitm-modal/ConfirmModal';
import { AnimatePresence, motion } from 'framer-motion';

interface ICategoryProps {
    onDelete?: () => void;
    title: string;
    id: string;
    cardsCount: number;
}

const Category: React.FC<ICategoryProps> = ({ title, onDelete, id, cardsCount }) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const handleClick = () => {
        navigate(`/category/${id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        onDelete?.();
        setIsDeleteModalOpen(false);
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    return (
        <div className={styles.container}>
            <div className={styles.main_content}>
                <div className={styles.info_container} onClick={handleClick}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.cards_count}>{`Карточек: ${cardsCount}`}</p>
                    {/* <p className={styles.cards_count}>{`Последний раз обновлено: ${updatedAt}`}</p> */}
                </div>
                <AnimatePresence mode='wait'>
                    {onDelete && (
                        <motion.div
                            className={styles.edit_container}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
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
            </div>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title='Удаление категории'
                message='Вы уверены, что хотите удалить эту категория? Все карточки в этой категории так же будут удалены'
                confirmText='Удалить'
                cancelText='Отмена'
            />
        </div>
    )
}

export default Category
