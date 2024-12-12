import React, { useCallback, useEffect, useState } from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'
import { useCategories } from '../../context/categoryContext'
import Input from '../../input/Input'
import { userService } from '../../../api/services/user.service'
import NameModal from '../../name-modal/NameModal'

const MainPage = () => {
    const { categories, addCategory, removeCategory } = useCategories();
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await userService.getCurrentUser();
                setDisplayName(userData.displayName || userData.login);
            } catch (error) {
                console.log('Failed to fetch user data', error);
            }
        };
        fetchUserData();
    }, []);

    const handleNameSave = async (newName: string) => {
        try {
            const updatedUser = await userService.updateDisplayName(newName);
            setDisplayName(updatedUser.displayName || updatedUser.login);
        } catch (error) {
            console.log('Failed to update display name', error);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryTitle.trim()) {
            addCategory(newCategoryTitle);
            setNewCategoryTitle('');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.welcome}>Доброе утро,{' '}<span className={styles.user_name} onClick={() => setIsNameModalOpen(true)}>{displayName}!</span></h1>
            <NameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSave={handleNameSave}
                initialName={displayName}
            />

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
