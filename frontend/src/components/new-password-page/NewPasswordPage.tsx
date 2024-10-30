import React, { useState } from 'react'
import styles from './new-password-page.module.css'
import Button from '../button/Button'
import { createConfirmPasswordRules, passwordValidationRules } from '../utils/validation-rules'
import PasswordInput from '../password-input/PasswordInput'

const NewPasswordPage = () => {
    const [password, setPassword] = useState<string>('');
    return (
        <div className={styles.container}>
            <PasswordInput
                title='Введите новый пароль'
                required
                validationRules={passwordValidationRules}
            />
            <PasswordInput
                title='Повторите новый пароль'
                required
                validationRules={createConfirmPasswordRules(password)}
            />
            <span className={styles.message}>Пароль успешно изменен!</span>
            <Button text='Готово' />
        </div>
    )
}

export default NewPasswordPage
