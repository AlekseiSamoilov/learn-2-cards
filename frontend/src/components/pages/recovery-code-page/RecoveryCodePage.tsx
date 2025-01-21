import { useEffect, useState } from 'react'
import styles from './recovery-code-page.module.css'
import Button from '../../button/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../loading-spinner/LoadingSpinner'

const RecoveryCodePage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { recoveryCode } = location.state || {};
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
            <a href='/' className={styles.logo}>Листай <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай</a>
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
