import React from 'react'
import styles from './recovery-code-mage.module.css'
import Button from '../button/Button'

const RecoveryCodePage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Код для восстановления пароля</h1>
            <h2 className={styles.sub_title}>Ваш код для восстановления
                пароля, сохраните его</h2>
            <div className={styles.code_display}>KENGURU</div>
            <Button text='Сохранил' />
        </div>
    )
}

export default RecoveryCodePage
