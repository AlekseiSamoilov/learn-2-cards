import React, { useState } from 'react';
import styles from './category-page.module.css';
import Button from '../../button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../context/categoryContext';
import AddWordForm from '../../add-word-form/AddWordForm';
import WordCard from '../../wordCard/WordCard';
import { toast } from 'react-toastify';

const CategoryPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const { categories, words, addCard, removeWord, updateWord } = useCategories();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [cardsToRepeat, setCardsToRepeat] = useState<string>('');

    const category = categories.find(c => c._id === categoryId);
    const categoryWords = words.filter(w => w.categoryId === categoryId);

    if (!categoryId) {
        return <div className={styles.not_found}>Категория не найдена</div>
    }

    if (!category) {
        return <div className={styles.not_found}>Категория не найдена</div>
    }

    const handleAddCard = async (id: string, frontside: string, backside: string, hintImageUrl?: string) => {
        // if (!frontside.trim() || !backside.trim()) {
        //     toast.error('Необходимо заполнить обе стороны карточки');
        //     return;
        // }
        try {
            await addCard(frontside, backside, id);
            toast.success('Карточка успешно создана');
        } catch (error: any) {
            error.response?.data?.message || 'Failed to create card';
            toast.error(error);
            console.error('Create card error:', error)
        }
    };

    const handleStartRepeat = () => {
        const count = parseInt(cardsToRepeat);
        if (count > 0 && count <= categoryWords.length) {
            const selectedCards = categoryWords.slice(0, count).map(word => ({
                id: word.id,
                frontside: word.frontside,
                backside: word.backside,
                totalShows: word.totalShows,
                correctAnswers: word.correctAnswers,
                hintImageUrl: word.hintImageUrl
            }));
            navigate(`/review/${categoryId}`, { state: { cards: selectedCards } });
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{category.title}</h1>
            {showAddForm ? (
                <AddWordForm
                    onSubmit={handleAddCard}
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
                                hintImageUrl={word.hintImageUrl}
                                onDelete={() => removeWord(word.id)}
                                onEdit={(frontside, backside, hintImageUrl) => updateWord(word.id, frontside, backside, hintImageUrl)}
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
