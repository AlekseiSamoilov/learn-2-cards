import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './main-page.module.css'
import Category from '../../category/Category'
import Button from '../../button/Button'
import { useCategories } from '../../context/categoryContext'
import Input from '../../input/Input'
import { userService } from '../../../api/services/user.service'
import { toast } from 'react-toastify'
import LoadingSpinner from '../../loading-spinner/LoadingSpinner'
import { AnimatePresence, motion } from 'framer-motion'
import ConfirmModal from '../../confitm-modal/ConfirmModal'
import EditCategoryModal from '../../edit-category-modal/EditCategoryModal'
import { categoryNameValidation } from '../../utils/validation-rules'
import { dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

const NameModal = React.lazy(() => import('../../name-modal/NameModal'));


const MainPage = () => {
    const { categories, addCategory, removeCategory, initializeCategories, getCardCountByCategory, updateCategory, reorderCategories } = useCategories();
    const [newCategoryTitle, setNewCategoryTitle] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [addNewCategory, setAddNewCategory] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<{ id: string, title: string } | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const ref = useRef(null);
    const [isDraggedOver, setIsDraggedOver] = useState<boolean>(false);
    const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return dropTargetForElements({
            element: el,
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
            getData: () => ({ location }),
        })
    }, []);

    useEffect(() => {
        return monitorForElements({
            onDragStart({ location }) {
                const target = location.current.dropTargets[0];
                if (target) {
                    setDropTargetIndex(target.data.index as number);
                }
            },
            onDrag({ location }) {
                const target = location.current.dropTargets[0];
                if (target) {
                    setDropTargetIndex(target.data.index as number);
                }
            },
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) return;

                const sourceIndex = source.data.index as number;
                const destinationIndex = destination.data.index as number;

                if (typeof sourceIndex === 'number' &&
                    typeof destinationIndex === 'number' &&
                    sourceIndex !== destinationIndex) {
                    reorderCategories(sourceIndex, destinationIndex);
                }
                setDropTargetIndex(null)
            }
        })
    }, [categories, reorderCategories])

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

    const handleAddCategory = async () => {
        setAddNewCategory(true);
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

    const handleDeleteClick = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            await removeCategory(categoryToDelete);
            setCategoryToDelete(null);
            setIsDeleteModalOpen(false);
            setIsEditing(false)
        }
    };

    const handleEditClick = (categoryId: string) => {
        const category = categories.find(cat => cat._id === categoryId);
        if (category) {
            setCategoryToEdit({ id: category._id, title: category.title });
            setIsEditModalOpen(true);
        }
    };

    const handleEditSave = async (newTitle: string) => {
        if (categoryToEdit) {
            try {
                await updateCategory(categoryToEdit.id, newTitle);
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Ошибка при обновлении категории');
            } finally {
                setIsEditModalOpen(false);
                setCategoryToEdit(null);
                setIsEditing(false)
            }

        }
    };

    return (
        <div className={`${styles.container} ${isDraggedOver ? styles.dragg_over : ''}`} ref={ref}>
            <a href='/' className={styles.logo}>Листай <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z"></path></svg> Знай</a>
            <div className={styles.header_container}>
                <h1 className={styles.welcome}>Добро пожаловать, <span className={styles.user_name} onClick={() => setIsNameModalOpen(true)}>{displayName}!</span></h1>
                <div className={styles.header_buttons_container}>
                    <button onClick={() => setIsEditing(!isEditing)} className={styles.edit_button}>{isEditing ?
                        <svg stroke="currentCollor" fill="currentCollor" stroke-width="0" viewBox="0 0 24 24" height="22px" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                        :
                        <svg stroke="currentCollor" fill="currentCollor" stroke-width="0" viewBox="0 0 16 16" height="22px" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"></path></svg>
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
                {categories.map((category, index) => (
                    <div
                        key={category._id}
                        ref={el => {
                            if (el) {
                                dropTargetForElements({
                                    element: el,
                                    getData: () => ({ index }),
                                });
                            }
                        }}
                        className={`${styles.category_wrapeer} ${dropTargetIndex === index ? styles.drop_target : ''
                            }`}
                    >
                        <Category
                            cardsCount={getCardCountByCategory(category._id)}
                            id={category._id}
                            index={index}
                            title={category.title}
                            onDelete={isEditing ? handleDeleteClick : undefined}
                            onEdit={isEditing ? handleEditClick : undefined}
                        />
                    </div>
                ))}
            </div>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title='Удаление категории'
                message='Вы уверены, что хотите удалить эту категорию? Все карточки в этой категории также будут удалены'
                confirmText='Удалить'
                cancelText='Отмена'
            />

            {
                categoryToEdit && (
                    <EditCategoryModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setCategoryToEdit(null);
                        }}
                        onSave={handleEditSave}
                        initialTitle={categoryToEdit.title}
                    />
                )
            }

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
                                validationRules={categoryNameValidation}
                            />
                        </motion.div>
                        <motion.div
                            className={styles.add_buttons}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Button onClick={handleAddCategory} disabled={newCategoryTitle.length <= 1 || newCategoryTitle.length > 25} text='Добавить' width='medium' />
                            <Button onClick={() => setAddNewCategory(false)} text='Отмена' width='medium' />
                        </motion.div>

                    </motion.div>)
                }
            </AnimatePresence>
        </div >
    )
}

export default MainPage
