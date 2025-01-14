import { useState } from 'react'
import Input from '../../input/Input'
import Button from '../../button/Button'
import styles from './recovery-password-page.module.css'
import { loginValidationRules, recoveryCodeValidationRules } from '../../utils/validation-rules'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../../../api/services/auth.service'
import PasswordInput from '../../password-input/PasswordInput'

const RecoveryPasswordPage = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [recoveryCode, setRecoveryCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    const submitNewPassword = async () => {
        if (!login || !recoveryCode || !newPassword) {
            toast.error('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await authService.resetPassword({
                login,
                recoveryCode,
                newPassword
            });
            if (response && response.recoveryCode) {
                navigate('/recovery-code', {
                    state: {
                        recoveryCode: response.recoveryCode,
                        login: login,
                    },
                    replace: true
                });
                toast.success('Пароль успешно изменен');
            } else {
                throw new Error('No recovery code in response');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Ошибка при восстановлении пароля';
            toast.error(message);
        }
    }

    return (
        <div className={styles.container}>
            <a href='/' className={styles.logo}>Листай  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай</a>
            <h1 className={styles.title}>Восстановление пароля</h1>
            <Input
                title='Введите логин'
                required
                validationRules={loginValidationRules}
                onChange={(e) => setLogin(e.target.value)}
            />
            <Input
                title='Введите код для восстановления пароля'
                required
                validationRules={recoveryCodeValidationRules}
                onChange={(e) => setRecoveryCode(e.target.value)}
            />
            <PasswordInput
                title='Новый пароль'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='Введите новый пароль'
            />
            <Button onClick={submitNewPassword} width='large' text='Сменить пароль' />
            <div className={styles.goto}>
                <p className={styles.remember}>Вспомнили пароль?</p>
                <a href='/login' className={styles.goto_login}>Войти</a>
            </div>
        </div>
    )
}

export default RecoveryPasswordPage
