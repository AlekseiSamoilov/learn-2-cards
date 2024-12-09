import React, { useState } from 'react'
import Input from '../../input/Input'
import Button from '../../button/Button'
import styles from './login-page.module.css'
import { loginValidationRules, passwordValidationRules } from '../../utils/validation-rules'
import PasswordInput from '../../password-input/PasswordInput'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, error, isLoading } = useAuth();
    const [loginValue, setLoginValue] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [formError, setFormError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        try {
            if (!loginValue.trim() || !password.trim()) {
                setFormError('Пожалуйста, заполните все поля');
                return;
            }

            const response = await login({
                login: loginValue,
                password: password
            });

            if (response.token) {
                localStorage.setItem('token', response.token);
                navigate('/main');
            }
        } catch (err) {
            setFormError(error || 'Ошибка при входе');
            console.error('Ошибка логина:', err);
        }
    };

    const handleRecoverPassword = () => {
        navigate('/recovery-password')
    }

    return (
        <div className={styles.container} >
            {error && <div>{error}</div>}
            <Input
                value={loginValue}
                title='Введите логин'
                onChange={(e) => setLoginValue(e.target.value)}
                validationRules={loginValidationRules}
                required
                error={formError}
            />
            <PasswordInput
                title='Введите пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validationRules={passwordValidationRules}
                required
            />
            {formError && (
                <div className={styles.error_message}>{formError}</div>
            )}
            <Button onClick={handleSubmit} width='large' text={isLoading ? 'Загрузка' : 'Далее'} disabled={isLoading} />
            <Button onClick={handleRecoverPassword} width='large' text='Восстановить пароль' disabled={isLoading} />
        </div>
    )
}

export default LoginPage
