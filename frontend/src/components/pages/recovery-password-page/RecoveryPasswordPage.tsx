import React from 'react'
import Input from '../../input/Input'
import Button from '../../button/Button'
import styles from './recovery-password-page.module.css'
import { loginValidationRules, recoveryCodeValidationRules } from '../../utils/validation-rules'
import { useNavigate } from 'react-router-dom'
import { sub } from 'framer-motion/client'

const RecoveryPasswordPage = () => {
    const navigate = useNavigate();

    const submitNewPassword = () => {
        navigate('/new-password')
    }
    return (
        <div className={styles.container}>
            <Input
                title='Введите логин'
                required
                validationRules={loginValidationRules}
            />
            <Input
                title='Введите код для восстановления пароля'
                required
                validationRules={recoveryCodeValidationRules}
            />
            <Button onClick={submitNewPassword} width='large' text='Далее' />
        </div>
    )
}

export default RecoveryPasswordPage
