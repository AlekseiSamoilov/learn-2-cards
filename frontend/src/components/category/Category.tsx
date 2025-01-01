import React, { useState } from 'react'
import styles from './category.module.css'
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../confitm-modal/ConfirmModal';
import { ICategory } from '../../api/types/category.types';
import { useCategories } from '../context/categoryContext';
import { toast } from 'react-toastify';

interface ICategoryProps {
    onDelete?: () => void;
    isEdit?: () => Promise<ICategory>
    title: string;
    id: string;

}

const Category: React.FC<ICategoryProps> = ({ title, onDelete, isEdit, id }) => {
    // const { categories, updateCategory } = useCategories();
    // const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
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

    const handleEditClick = () => {
    }

    return (
        <div className={styles.container} onClick={handleClick}>
            <h3 className={styles.title}>{title}</h3>
            {onDelete && (
                <div>
                    <button className={styles.edit_button}
                        onClick={handleEditClick}
                    >✎</button>
                    <button
                        className={styles.delete_button}
                        onClick={handleDeleteClick}
                    >✖</button>
                </div>
            )}

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
