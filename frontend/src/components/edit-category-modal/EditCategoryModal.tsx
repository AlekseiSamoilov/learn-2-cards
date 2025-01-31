import React, { useState } from 'react'
import Input from '../input/Input';
import Modal from '../modal/modal';
import styles from './edit-category-modal.module.css'
import Button from '../button/Button';
import { categoryNameValidation } from '../utils/validation-rules';

interface IEditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTitle: string) => void;
    initialTitle: string;
}

const EditCategoryModal: React.FC<IEditCategoryModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialTitle,
}) => {
    const [newTitle, setNewTitle] = useState(initialTitle);

    const handleSave = () => {
        if (newTitle.trim()) {
            onSave(newTitle.trim());
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Изменить название категории' size='small'>
            <Input
                title='Новое название'
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder='Введите новое название'
                validationRules={categoryNameValidation}
            />
            <div className={styles.buttons}>
                <Button onClick={handleSave} disabled={newTitle.length <= 1 || newTitle.length > 25} text='Сохранить' width='medium' />
                <Button onClick={onClose} text='Отмена' width='medium' />
            </div>
        </Modal>
    );
};

export default EditCategoryModal
