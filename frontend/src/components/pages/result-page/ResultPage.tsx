import React from 'react'
import styles from './result-page.module.css'
import Button from '../../button/Button'

const ResultPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Результаты</h1>
            <div className={styles.result_container}>
                <h2 className={styles.result}>Правильных ответов 7 из 15</h2>
                <h3 className={styles.summary}>Это 50%, неплохо, но есть куда стремиться!</h3>
            </div>
            <Button width='large' text='К категориям' />
        </div>
    )
}

export default ResultPage
