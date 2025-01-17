import React, { useState } from 'react'
import Modal from '../modal/modal';
import styles from './name-modal.module.css'
import Input from '../input/Input';
import Button from '../button/Button';
import { authService } from '../../api/services/auth.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name);
            onClose();
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
            toast.success('Вы успешно вышли из аккаунта');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Произошла ошибка при выходе из аккаунта');
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialName ? 'Изменить имя' : 'Как вас называть?'}
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <button onClick={handleLogout} className={styles.logout}><svg stroke="#136147" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
                <Input title='Введите ваше имя:'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
            </form>
        </Modal>
    )
}

export default NameModal
