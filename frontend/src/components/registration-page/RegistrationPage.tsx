import React, { useState } from 'react'
import Input from '../input/Input'
import PasswordInput from '../password-input/PasswordInput';

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
        <div>
            <h1>Registration</h1>
            <Input
                onChange={(e) => setLogin(e.target.value)}
                value={login}
                title='Введите логин'
                placeholder='login placeholer'
                validationRules={loginRules}
                required
            />
            <PasswordInput
                title='Пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
            />
            <PasswordInput
                title='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Repeat password'
                confirm
                compareWith={password}
            />
        </div>
    )
}
