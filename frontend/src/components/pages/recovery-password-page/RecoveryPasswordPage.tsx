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

    const handleReturnToTheLogin = () => {
        navigate('/login');
    }

    return (
        <div className={styles.container}>
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
            <Button onClick={handleReturnToTheLogin} width='large' text='Вернуться на страницу авторизации' />

        </div>
    )
}

export default RecoveryPasswordPage
