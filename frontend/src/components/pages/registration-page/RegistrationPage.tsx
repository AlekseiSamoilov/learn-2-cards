import React, { useEffect, useState } from 'react'
import Input from '../../input/Input'
import PasswordInput from '../../password-input/PasswordInput';
import styles from './registration-page.module.css'
import Button from '../../button/Button';
import { createConfirmPasswordRules, loginValidationRules, passwordValidationRules } from '../../utils/validation-rules';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function RegistrationPage() {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passError, setPassError] = useState<boolean>(false);
    const confirmPasswordRules = createConfirmPasswordRules(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const registerData = {
                login,
                password,
                displayName: login
            };
            const response = await register(registerData);

            if (response && response.user && response.user.recoveryCode) {
                navigate('/recovery-code', {
                    state: {
                        recoveryCode: response.user.recoveryCode,
                        login: response.user.login
                    }
                });
            } else {
                console.log('Invalid response format:', response);
            }
        } catch (err) {
            console.error('Ошибка регистрации', err)
        }
    };

    useEffect(() => {
        if (password !== confirmPassword) {
            setPassError(true);
        } else {
            setPassError(false)
        }
    }, [password, confirmPassword])

    return (
        <div className={styles.container}>
            <a href='/' className={styles.logo}>Листай <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай</a>
            <h1 className={styles.title}>Регистрация</h1>
            <p className={styles.offline}>Проводятся технические работы.</p>
            <p className={styles.offline}>Регистрация временно отключена.</p>
            <h2 className={styles.subtitle}>Доброе пожаловать!</h2>
            <Input
                onChange={(e) => setLogin(e.target.value)}
                value={login}
                title='Введите логин'
                placeholder='Введите логин, от 4 до 10 символов'
                validationRules={loginValidationRules}
                required
            />
            <PasswordInput
                title='Пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Введите пароль, от 6 до 10 символов'
                validationRules={passwordValidationRules}
                required
            />
            <PasswordInput
                title='Введите пароль еще раз'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Повторите введенный пароль'
                validationRules={confirmPasswordRules}
                required
            />

            <Button width='large' onClick={handleSubmit} text={passError ? 'Пароли не совпадают' : 'Далее'} disabled={isLoading || passError || !login || !password} />
            <div className={styles.already_register}>
                <p>Уже зарегистрированы?</p>
                <a href='/login' className={styles.login_link} >Войти</a>
            </div>

        </div>
    )
}
