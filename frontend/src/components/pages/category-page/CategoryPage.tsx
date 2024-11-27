import React, { useState } from 'react';
import styles from './category-page.module.css';
import Button from '../../button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../context/categoryContext';
import AddWordForm from '../../add-word-form/AddWordForm';
import WordCard from '../../wordCard/WordCard';

const CategoryPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const { categories, words, addWord, removeWord } = useCategories();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [cardsToRepeat, setCardsToRepeat] = useState<string>('');

    const category = categories.find(c => c.id === categoryId);
    const categoryWords = words.filter(w => w.categoryId === categoryId);

    if (!categoryId) {
        return <div>Категория не найдена</div>
    }

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
            navigate(`/review/${categoryId}?count=${count}`);
        }
    };

    const handleEditWord = (wordId: string, frontside: string, backside: string) => {
        const updateWords = words.map(word =>
            word.id === wordId ? { ...word, frontside, backside } : word
        );
        setWords(updateWords)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{category.title}</h1>
            {showAddForm ? (
                <AddWordForm
                    onSubmit={handleAddWord}
                    onCancel={() => setShowAddForm(false)}
                />
            ) : (
                <>
                    <ul className={styles.words_list}>
                        {categoryWords.map(word => (
                            <WordCard
                                key={word.id}
                                frontside={word.frontside}
                                backside={word.backside}
                                isEditing={isEditing}
                                onDelete={() => removeWord(word.id)}
                                onEdit={(frontside, backside) => handleEditWord(word.id, frontside, backside)}
                            />
                        ))}
                    </ul>
                    <div className={styles.repeat_container}>
                        <p className={styles.repeat_title}>Сколько карточек повторим?</p>
                        <input
                            className={styles.repeat_input}
                            type='number'
                            min='1'
                            max={categoryWords.length}
                            value={cardsToRepeat}
                            onChange={(e) => setCardsToRepeat(e.target.value)}
                        />
                        <Button
                            text='Начать'
                            width='large'
                            onClick={handleStartRepeat}
                            disabled={!cardsToRepeat || categoryWords.length === 0}
                        />
                    </div>
                </>
            )}
            <div className={styles.buttons}>
                <Button
                    text='Назад к категориям'
                    width='small'
                    onClick={() => navigate('/main')}
                />
                {!showAddForm && (
                    <Button
                        text='Создать карточку'
                        width='small'
                        onClick={() => setShowAddForm(true)}
                    />
                )}
                <Button
                    text={isEditing ? 'Готово' : 'Редактировать'}
                    width='small'
                    onClick={() => setIsEditing(!isEditing)}
                />
            </div>
        </div>
    )
}

export default CategoryPage
