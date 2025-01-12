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
    const { login, isLoading } = useAuth();
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
        } catch (err: any) {
            setFormError('Ошибка при входе');
            console.error('Ошибка логина:', err);
        }
    };


    return (
        <div className={styles.container} >
            <h1 className={styles.title}>Вход</h1>
            <p className={styles.logo}>Листай🍃Знай</p>
            <h2 className={styles.sub_title}>С возвращением!</h2>
            <Input
                value={loginValue}
                title='Логин'
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder='Введите логин'
                validationRules={loginValidationRules}
                required
                error={formError}
            />
            <PasswordInput
                title='Пароль'
                value={password}
                placeholder='Введите пароль'
                onChange={(e) => setPassword(e.target.value)}
                validationRules={passwordValidationRules}
                required
            />
            <div className={styles.buttons_container}>
                <Button onClick={handleSubmit} width='large' text={isLoading ? 'Загрузка' : 'Далее'} disabled={isLoading} />

            </div>
            <a className={styles.password_revocery_link} href='/recovery-password'>Забыли пароль?</a>
            <div className={styles.away_container}>
                <p className={styles.not_register}>У вас нет аккаунта?</p>
                <a href='/register' className={styles.goto_register}>Создать аккаунт</a>
            </div>


        </div>
    )
}

export default LoginPage
