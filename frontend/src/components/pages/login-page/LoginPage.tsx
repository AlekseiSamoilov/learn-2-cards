import React, { useState } from 'react'
import Input from '../../input/Input'
import Button from '../../button/Button'
import styles from './login-page.module.css'
import { loginValidationRules, passwordValidationRules } from '../../utils/validation-rules'
import PasswordInput from '../../password-input/PasswordInput'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const navigate = useNavigate()
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = () => {
        navigate('/main')
    }

    const handleRecoverPassword = () => {
        navigate('/recovery-password')
    }

    return (
        <div className={styles.container} >
            <Input
                value={login}
                title='Введите логин'
                onChange={(e) => setLogin(e.target.value)}
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
            <Button onClick={handleSubmit} width='large' text='Далее' />
            <Button onClick={handleRecoverPassword} width='large' text='Восстановить пароль' />
        </div>
    )
}

export default LoginPage
