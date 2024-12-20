import React, { useEffect } from 'react'
import styles from './recovery-code-page.module.css'
import Button from '../../button/Button'
import { useLocation, useNavigate } from 'react-router-dom'

const RecoveryCodePage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { recoveryCode, login } = location.state || {};

    useEffect(() => {
        if (!recoveryCode && location.state) {
            navigate('/register');
        }
    }, [recoveryCode, navigate, location.state]);

    const handleSaved = () => {
        navigate('/login')
    }

    if (!location.state || !recoveryCode) {
        return <div>Loading...</div>
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
