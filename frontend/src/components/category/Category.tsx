import React, { useState } from 'react'
import styles from './category.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmModal from '../confitm-modal/ConfirmModal';
import { ICategory } from '../../api/types/category.types';
import { useCategories } from '../context/categoryContext';
import { AnimatePresence, motion } from 'framer-motion';

interface ICategoryProps {
    onDelete?: () => void;
    // isEdit?: () => Promise<ICategory>
    title: string;
    id: string;

}

const Category: React.FC<ICategoryProps> = ({ title, onDelete, id }) => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const { cards } = useCategories()
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const categoryCards = cards.filter(w => w.categoryId === categoryId);

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
        setIsEdit(true)
        console.log('Hi!')
    }

    return (
        <div className={styles.container}>
            <div className={styles.main_content}>
                <div className={styles.info_container}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.cards_count}>{`Карточек: ${categoryCards.length}`}</p>
                </div>
                <AnimatePresence mode='wait'>
                    {onDelete && (
                        <motion.div
                            className={styles.edit_container}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >

                            <button className={styles.edit_button}
                                onClick={handleEditClick}
                            >✎</button>
                            <button
                                className={styles.delete_button}
                                onClick={handleDeleteClick}
                            >✖</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <button onClick={handleClick} className={styles.goto}><svg stroke="#136147cc" fill="#136147cc" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M11.999,1.993c-5.514,0.001-10,4.487-10,10.001s4.486,10,10.001,10c5.513,0,9.999-4.486,10-10 C22,6.48,17.514,1.994,11.999,1.993z M12,19.994c-4.412,0-8.001-3.589-8.001-8s3.589-8,8-8.001C16.411,3.994,20,7.583,20,11.994 C19.999,16.405,16.41,19.994,12,19.994z"></path><path d="M12 10.994L8 10.994 8 12.994 12 12.994 12 16 16.005 11.995 12 7.991z"></path></svg></button>

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
