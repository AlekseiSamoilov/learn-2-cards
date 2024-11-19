import React from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'

const MainPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.welcome}>Доброе утро, <span className={styles.user_name}>Алексей!</span></h1>
            <div className={styles.category_list}>
                <Category title='Category1' />
                <Category title='Category2' />
                <Category title='Category3' />
                <Category title='Category4' />
            </div>
            <Button text='Редактировать' />
        </div>
    )
}

export default MainPage
