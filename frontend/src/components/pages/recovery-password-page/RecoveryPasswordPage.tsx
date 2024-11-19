import React from 'react'
import Input from '../input/Input'
import Button from '../button/Button'
import styles from './recovery-password-page.module.css'
import { loginValidationRules, recoveryCodeValidationRules } from '../utils/validation-rules'

const RecoveryPasswordPage = () => {
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
            <Button text='Далее' />
        </div>
    )
}

export default RecoveryPasswordPage
