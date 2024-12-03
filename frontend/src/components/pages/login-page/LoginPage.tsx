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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ login: loginValue, password });
            navigate('/main');
        } catch (err) {
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
            />
            <PasswordInput
                title='Введите пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validationRules={passwordValidationRules}
                required
            />
            <Button onClick={handleSubmit} width='large' text={isLoading ? 'Загрузка' : 'Далее'} disabled={isLoading} />
            <Button onClick={handleRecoverPassword} width='large' text='Восстановить пароль' disabled={isLoading} />
        </div>
    )
}

export default LoginPage
