import React, { useState } from 'react';
import styles from './category-page.module.css';
import Button from '../../button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../context/categoryContext';
import AddWordForm from '../../add-word-form/AddWordForm';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { categories, words, addWord, removeWord } = useCategories();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [cardsToRepeat, setCardsToRepeat] = useState<string>('');

    const category = categories.find(c => c.id === categoryId);
    const categoryWords = words.filter(w => w.categoryId === categoryId);

    if (!category) {
        return <div>Категория не найдена</div>
    }

    const handleAddWord = (frontside: string, backside: string) => {
        addWord(categoryId, frontside, backside);
        setShowAddForm(false)
    };

    const handleStartRepeat = () => {
        const count = parseInt(cardsToRepeat);
        if (count > 0 && count <= categoryWords.length) {
            navigate(`/review${categoryId}?count=${count}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{category.title}</h1>
            {showAddForm ? (
                <AddWordForm
                    onSubmit={handleAddWord}
                    onCancel={() => setShowAddForm(false)}
                />
            ) : (
                <ul className={styles.words_list}></ul>
            )}
            <div className={styles.repeat_container}>
                <p className={styles.repeat_title}>Сколько карточек повторим?</p>
                <input className={styles.repeat_input}></input>
                <Button text='Начать' width='large' />
            </div>
            <div className={styles.buttons}>
                <Button text='Назад к категориям' width='medium' />
                <Button text='Создать карточку' width='medium' />
            </div>
        </div>
    )
}

export default CategoryPage
