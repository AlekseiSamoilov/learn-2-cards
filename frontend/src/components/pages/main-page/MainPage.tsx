import React, { useCallback, useEffect, useState } from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'
import { useCategories } from '../../context/categoryContext'
import Input from '../../input/Input'
import { userService } from '../../../api/services/user.service'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../loading-spinner/LoadingSpinner'
const NameModal = React.lazy(() => import('../../name-modal/NameModal'));

const MainPage = () => {
    const { categories, addCategory, removeCategory, initializeCategories } = useCategories();
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [addNewCategory, setAddNewCategory] = useState<boolean>(false);

    const initialize = useCallback(() => {
        initializeCategories();
    }, [initializeCategories])

    const fetchUserData = async () => {
        try {
            const userData = await userService.getCurrentUser();
            setDisplayName(userData.displayName || userData.login);
        } catch (error) {
            console.log('Failed to fetch user data', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            initialize();
            fetchUserData();
        }
    }, [initialize]);

    const handleNameSave = async (newName: string) => {
        try {
            const updatedUser = await userService.updateDisplayName(newName);
            setDisplayName(updatedUser.displayName);
            setIsNameModalOpen(false);
        } catch (error) {
            console.log('Failed to update display name', error);
        }
    };

    const handleAddCategory = async () => {
        setAddNewCategory(true)
        if (!newCategoryTitle.trim()) {
            toast.error('Необходимо ввести имя категории');
            return;
        }
        try {
            await addCategory(newCategoryTitle.trim());
            setNewCategoryTitle('');
            setAddNewCategory(false);
            toast.success('Категория успешно создана');
        } catch (error: any) {
            setAddNewCategory(false)
            error.response?.data?.message || 'Failed to create category';
            toast.error(error);
            console.error('Create category error', error)
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header_container}>
                <h1 className={styles.welcome}>Добро пожаловать, <span className={styles.user_name} onClick={() => setIsNameModalOpen(true)}>{displayName}!</span></h1>
                <div className={styles.header_buttons_container}>
                    <button onClick={() => setIsEditing(!isEditing)} className={styles.edit_button}>{isEditing ?
                        <svg stroke="green" fill="green" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                        :
                        <svg stroke="green" fill="green" stroke-width="0" version="1.2" baseProfile="tiny" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M21.561 5.318l-2.879-2.879c-.293-.293-.677-.439-1.061-.439-.385 0-.768.146-1.061.439l-3.56 3.561h-9c-.552 0-1 .447-1 1v13c0 .553.448 1 1 1h13c.552 0 1-.447 1-1v-9l3.561-3.561c.293-.293.439-.677.439-1.061s-.146-.767-.439-1.06zm-10.061 9.354l-2.172-2.172 6.293-6.293 2.172 2.172-6.293 6.293zm-2.561-1.339l1.756 1.728-1.695-.061-.061-1.667zm7.061 5.667h-11v-11h6l-3.18 3.18c-.293.293-.478.812-.629 1.289-.16.5-.191 1.056-.191 1.47v3.061h3.061c.414 0 1.108-.1 1.571-.29.464-.19.896-.347 1.188-.64l3.18-3.07v6zm2.5-11.328l-2.172-2.172 1.293-1.293 2.171 2.172-1.292 1.293z"></path></svg>

                    }
                    </button>
                </div>
                {/* <Button
                    width='large'
                    text={isEditing ? 'Готово' : 'Редактировать'}
                    onClick={() => setIsEditing(!isEditing)}
                /> */}
            </div>
            <React.Suspense fallback={<LoadingSpinner />}>
                <NameModal
                    isOpen={isNameModalOpen}
                    onClose={() => setIsNameModalOpen(false)}
                    onSave={handleNameSave}
                    initialName={displayName}
                />
            </React.Suspense>
            <div className={styles.category_list}>
                {categories.map(category => (
                    <Category
                        key={category._id}
                        id={category._id}
                        title={category.title}
                        onDelete={isEditing ? () => removeCategory(category._id) : undefined} />
                ))}
            </div>
            <button className={styles.add_category_button} onClick={handleAddCategory}> + Добавить категорию</button>

            {addNewCategory && (
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
        </div>
    )
}

export default MainPage
