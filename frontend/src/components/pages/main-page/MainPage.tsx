import React, { useCallback, useState } from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'
import { useCategories } from '../../context/categoryContext'

const MainPage = () => {
    const { categories, addCategory, removeCategory } = useCategories();
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleAddCategory = () => {
        if (newCategoryTitle.trim()) {
            addCategory(newCategoryTitle);
            setNewCategoryTitle('');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.welcome}>Доброе утро, <span className={styles.user_name}>Алексей!</span></h1>
            <div className={styles.category_list}>
                <Category title='Category1' />
                <Category title='Category2' />
                <Category title='Category3' />
                <Category title='Category4' />
            </div>
            <Button width='large' text='Редактировать' />
        </div>
    )
}

export default MainPage
