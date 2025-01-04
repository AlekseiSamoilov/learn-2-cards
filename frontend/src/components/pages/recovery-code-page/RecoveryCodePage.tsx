import React, { useEffect, useState } from 'react'
import styles from './recovery-code-page.module.css'
import Button from '../../button/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../loading-spinner/LoadingSpinner'

const RecoveryCodePage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { recoveryCode, login } = location.state || {};
    const [isCopied, setIsCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!recoveryCode && location.state) {
            navigate('/register');
        }
    }, [recoveryCode, navigate, location.state]);

    const handleSaved = () => {
        navigate('/login')
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(recoveryCode).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }

    if (!location.state || !recoveryCode) {
        return <div><LoadingSpinner /></div>
    }
    return (
        <div className={styles.container}>
            <p className={styles.logo}>Листай🍃Знай</p>
            <h1 className={styles.title}>Код для восстановления пароля</h1>
            <h2 className={styles.subtitle}>Ваш код для восстановления
                пароля, сохраните его</h2>
            <div className={styles.code_display}>
                <span className={styles.code_word}>{recoveryCode}</span>
                <button onClick={copyToClipboard} className={styles.copy_button}>{isCopied ? 'Скопировано' : 'Скопировать'}</button>
            </div>
            <Button width='large' text='Сохранил' onClick={handleSaved} />
        </div >
    )
}

export default RecoveryCodePage
