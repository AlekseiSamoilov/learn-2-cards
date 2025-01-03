import React, { useState } from 'react'
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
    const [displayName, setDisplayName] = useState<string>('');
    const [formError, setFormError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (password !== confirmPassword) {
            setFormError('Пароли не совпадают');
            return;
        };

        try {
            const registerData = {
                login,
                password,
                displayName: displayName.trim() || login
            };

            console.log('Sending registration data:', registerData);

            const response = await register(registerData);
            console.log('Registration response:', response);

            if (response && response.user && response.user.recoveryCode) {
                console.log('Navigation to recovery code page with:', {
                    recoveryCode: response.user.recoveryCode,
                    login: response.user.login
                });

                navigate('/recovery-code', {
                    state: {
                        recoveryCode: response.user.recoveryCode,
                        login: response.user.login
                    }
                });
            } else {
                console.log('Invalid response format:', response);
                setFormError('Ошибка при регистрации, неверный формат ответа');
            }
        } catch (err) {
            console.error('Ошибка регистрации', err)
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Регистрация</h1>
            <p className={styles.logo}>Листай🍃Знай</p>
            <h2 className={styles.subtitle}>Доброе пожаловать!</h2>
            <Input
                onChange={(e) => setLogin(e.target.value)}
                value={login}
                title='Введите логин'
                placeholder='Введите логин, от 4 до 10 символов'
                validationRules={loginValidationRules}
                required
            />
            <Input
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                title='Введите имя'
                placeholder='Введите имя для отображения'
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
                validationRules={createConfirmPasswordRules(password)}
                required
            />
            <Button width='large' onClick={handleSubmit} text={isLoading ? 'Загрузка' : 'Далее'} disabled={isLoading || password !== confirmPassword} />
            <div className={styles.already_register}>
                <p>Уже зарегистрированы?</p>
                <a href='/login' className={styles.login_link} >Войти</a>
            </div>

        </div>
    )
}
