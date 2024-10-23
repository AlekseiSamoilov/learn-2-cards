import React, { useState } from 'react'
import Input from '../input/Input'

export default function RegistrationPage() {

    const [login, setLogin] = useState<string>('');

    const loginRules = [
        {
            validate: (value: string) => value.length >= 3,
            errorMessage: 'Логин не может быть короче 3 символов'
        },
        {
            validate: (value: string) => value.length <= 10,
            errorMessage: 'Логин не может быть длинее 10 символов'
        },
    ]


    return (
        <div>
            <h1>Registration</h1>
            <Input
                onChange={(e) => setLogin(e.target.value)}
                value={login} title='Введите логин'
                placeholder='login placeholer'
                validationRules={loginRules}
                required
            />
            <Input title='Введите пароль' placeholder='password placeholder' />
            <Input title='Снова введите пароль' placeholder='again password placeholder' />
        </div>
    )
}
