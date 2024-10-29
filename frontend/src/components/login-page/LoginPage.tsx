import React, { useState } from 'react'
import Input from '../input/Input'
import Button from '../button/Button'
import styles from './login-page.module.css'
import { loginValidationRules, passwordValidationRules } from '../utils/validation-rules'

const LoginPage = () => {

    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <div className={styles.container} >
            <Input
                value={login}
                title='Введите логин'
                onChange={(e) => setLogin(e.target.value)}
                validationRules={loginValidationRules}
                required
            />
            <Input
                title='Введите пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validationRules={passwordValidationRules}
                required
            />
            <Button text='Далее' />
            <Button text='Восстановить пароль' />
        </div>
    )
}

export default LoginPage
