import React, { useCallback, useState } from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'
import { useCategories } from '../../context/categoryContext'
import Input from '../../input/Input'

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
            <h1 className={styles.welcome}>Доброе утро, <span className={styles.user_name}>lol</span></h1>
            {isEditing && (
                <div className={styles.add_category}>
                    <Input
                        title='Новая категория'
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        placeholder='Название категории'
                    />
                    <Button onClick={handleAddCategory} text='Добавить' width='large' />
                </div>
            )}

            <div className={styles.category_list}>
                {categories.map(category => (
                    <Category
                        key={category.id}
                        id={category.id}
                        title={category.title}
                        onDelete={isEditing ? () => removeCategory(category.id) : undefined} />
                ))}
            </div>
            <Button
                width='large'
                text={isEditing ? 'Готово' : 'Редактировать'}
                onClick={() => setIsEditing(!isEditing)}
            />
        </div>
    )
}

export default MainPage
