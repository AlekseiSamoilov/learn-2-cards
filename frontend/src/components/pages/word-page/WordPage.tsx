import React from 'react'
import styles from './word-page.module.css'
import Button from '../../button/Button'

const WordPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Слова</h1>
            <div className={styles.word_container}>
                <div className={styles.faceside}>Мой дядя самых честных правил</div>
                <div className={styles.backside}>А.С. Пушкин</div>
                <div className={styles.hint}></div>
            </div>
            <div className={styles.buttons}>
                <Button text='Назад к списку' width='150px' />
                <Button text='Редактировать' width='150px' />
            </div>
        </div>
    )
}

export default WordPage
