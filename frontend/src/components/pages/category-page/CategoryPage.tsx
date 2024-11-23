import React from 'react';
import styles from './category-page.module.css';
import Button from '../../button/Button';

const CategoryPage = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Category Name</h1>
            <ul className={styles.words_list}>
                <li className={styles.word}>Word 1</li>
                <li className={styles.word}>Word 2</li>
                <li className={styles.word}>Word 3</li>
                <li className={styles.word}>Word 4</li>
            </ul>
            <div className={styles.repeat_container}>
                <p className={styles.repeat_title}>Сколько карточек повторим?</p>
                <input className={styles.repeat_input}></input>
                <Button text='Начать' width='300px' />
            </div>
            <div className={styles.buttons}>
                <Button text='Назад к категориям' width='150px' />
                <Button text='Создать карточку' width='150px' />
            </div>
        </div>
    )
}

export default CategoryPage
