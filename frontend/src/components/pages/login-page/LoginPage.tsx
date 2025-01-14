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
            <a href='/' className={styles.logo}>Листай <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай</a>
            <h1 className={styles.title}>Вход</h1>
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
