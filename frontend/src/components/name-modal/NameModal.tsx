import React, { useState } from 'react'
import Modal from '../modal/modal';
import styles from './name-modal.module.css'
import Input from '../input/Input';
import Button from '../button/Button';

interface INameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    initialName?: string;
}

const NameModal: React.FC<INameModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialName = ''
}) => {
    const [name, setName] = useState<string>(initialName);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialName ? 'Изменить имя' : 'Как вас называть?'}
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input title='Ваше имя'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Введите ваше имя'
                    required
                />
                <div className={styles.buttons}>
                    <Button
                        text='Сохранить'
                        width='medium'
                        onClick={handleSubmit}
                    />
                    <Button
                        text='Отмена'
                        width='medium'
                        onClick={onClose}
                    />
                </div>
                <Button
                    text='Выйти из аккаунта'
                    width='large'
                />
            </form>
        </Modal>
    )
}

export default NameModal
