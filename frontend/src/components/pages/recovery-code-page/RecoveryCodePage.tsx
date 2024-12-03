import React from 'react'
import styles from './recovery-code-page.module.css'
import Button from '../../button/Button'
import { useLocation, useNavigate } from 'react-router-dom'

const RecoveryCodePage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const recoveryCode = location.state?.recoveryCode;

    const handleSaved = () => {
        navigate('/login')
    }

    if (!recoveryCode) {
        navigate('/login');
        return null;
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Код для восстановления пароля</h1>
            <h2 className={styles.subtitle}>Ваш код для восстановления
                пароля, сохраните его</h2>
            <div className={styles.code_display}>
                <span className={styles.code_word}>{recoveryCode}</span>
            </div>
            <Button width='large' text='Сохранил' onClick={handleSaved} />
        </div >
    )
}

export default RecoveryCodePage
