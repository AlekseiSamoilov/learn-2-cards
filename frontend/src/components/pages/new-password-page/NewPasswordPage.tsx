import React from 'react'
import styles from './new-password-page.module.css'
import Button from '../button/Button'

const NewPasswordPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ваш новый пароль</h1>

            <div className={styles.code_display}>
                <span className={styles.code_word}>MyNewSuperPassword</span>
            </div>
            <span className={styles.message}>Сохраните его!</span>
            <Button text='Готово' />

        </div>
    )
}

export default NewPasswordPage
