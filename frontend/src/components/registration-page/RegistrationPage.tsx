import React, { useState } from 'react'
import Input from '../input/Input'
import PasswordInput from '../password-input/PasswordInput';
import styles from './registration-page.module.css'
import Button from '../button/Button';

export default function RegistrationPage() {

    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const loginRules = [
        {
            validate: (value: string) => value.length >= 3,
            errorMessage: 'Логин не может быть короче 3 символов'
        },
        {
            validate: (value: string) => value.length <= 10,
            errorMessage: 'Логин не может быть длинее 10 символов'
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return;
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Регистрация</h1>
            <Input
                onChange={(e) => setLogin(e.target.value)}
                value={login}
                title='Введите логин'
                placeholder='Введите логин, от 4 до 10 символов'
                validationRules={loginRules}
                required
            />
            <PasswordInput
                title='Пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Введите пароль, от 6 до 10 символов'
            />
            <PasswordInput
                title='Введите пароль еще раз'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Повторите введенный пароль'
                confirm
                compareWith={password}
            />
            <Button onClick={handleSubmit} text='Далее' />
        </div>
    )
}
