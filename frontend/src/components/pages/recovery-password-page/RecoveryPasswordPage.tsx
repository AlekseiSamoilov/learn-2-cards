import React, { useState } from 'react'
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const submitNewPassword = async () => {
        if (!login || !recoveryCode || !newPassword) {
            toast.error('Пожалуйста, заполните все поля');
            return;
        }

        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Восстановление пароля</h1>
            <p className={styles.logo}>Листай🍃Знай</p>
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
