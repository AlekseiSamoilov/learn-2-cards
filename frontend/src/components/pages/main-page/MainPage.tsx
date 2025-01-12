import React, { useCallback, useEffect, useState } from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'
import { useCategories } from '../../context/categoryContext'
import Input from '../../input/Input'
import { userService } from '../../../api/services/user.service'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../loading-spinner/LoadingSpinner'
import { AnimatePresence, motion } from 'framer-motion'
const NameModal = React.lazy(() => import('../../name-modal/NameModal'));

const MainPage = () => {
    const { categories, addCategory, removeCategory, initializeCategories, getCardCountByCategory } = useCategories();
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [addNewCategory, setAddNewCategory] = useState<boolean>(false);

    const initialize = useCallback(() => {
        initializeCategories();
    }, [initializeCategories]);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
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
            <p className={styles.logo}>Листай🍃Знай</p>
            <div className={styles.header_container}>
                <h1 className={styles.welcome}>Добро пожаловать, <span className={styles.user_name} onClick={() => setIsNameModalOpen(true)}>{displayName}!</span></h1>
                <div className={styles.header_buttons_container}>
                    <button onClick={() => setIsEditing(!isEditing)} className={styles.edit_button}>{isEditing ?
                        <svg stroke="#136147cc" fill="#136147cc" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                        :
                        <svg stroke="#136147cc" fill="#136147cc" stroke-width="0" viewBox="0 0 16 16" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"></path></svg>

                    }
                    </button>
                </div>
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
                        cardsCount={getCardCountByCategory(category._id)}
                        id={category._id}
                        title={category.title}
                        updatedAt={`${category.updatedAt ? formatDate(category.updatedAt) : ''}`}
                        onDelete={isEditing ? () => removeCategory(category._id) : undefined} />
                ))}
            </div>
            <AnimatePresence mode='wait'>
                {!addNewCategory ? (
                    <motion.button
                        className={styles.add_category_button}
                        onClick={() => setAddNewCategory(true)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    > + Добавить категорию
                    </motion.button>
                ) : (
                    <motion.div
                        className={styles.add_category}
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                            mass: 0.8,
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <Input
                                title='Новая категория'
                                value={newCategoryTitle}
                                onChange={(e) => setNewCategoryTitle(e.target.value)}
                                placeholder='Название категории'
                            />
                        </motion.div>
                        <motion.div
                            className={styles.add_buttons}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button onClick={handleAddCategory} text='Добавить' width='medium' />
                            <Button onClick={() => setAddNewCategory(false)} text='Отмена' width='medium' />
                        </motion.div>

                    </motion.div>)
                }
            </AnimatePresence>
        </div >
    )
}

export default MainPage
