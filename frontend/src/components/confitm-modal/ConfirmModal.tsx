import React from 'react'
import Modal from '../modal/modal';
import styles from './confirm-modal.module.css'
import Button from '../button/Button';

interface IConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal: React.FC<IConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
}) => {

    const handleConfirm = () => {
        onConfirm();
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
            <div className={styles.container}>
                <p className={styles.message}>{message}</p>
                <div className={styles.button}>
                    <Button text={confirmText}
                        onClick={handleConfirm}
                        width='medium'
                    />
                    <Button text={cancelText}
                        onClick={onClose}
                        width='medium'
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmModal
