import { ReactNode } from "react";
import styles from './modal.module.css'

interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<IModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium'
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={`${styles.modal} ${styles[`size_${size}`]}`}>
                {title && <h2 className={styles.title}>{title}</h2>}
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;