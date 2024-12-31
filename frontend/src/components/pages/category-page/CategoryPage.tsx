import React, { useEffect, useState } from 'react';
import styles from './category-page.module.css';
import Button from '../../button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../context/categoryContext';
import AddWordForm from '../../add-word-form/AddWordForm';
import WordCard from '../../wordCard/WordCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../loading-spinner/LoadingSpinner';

const CategoryPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const { categories, cards, addCard, removeCard, updateCard, loadCategoryCards, initializeCategories } = useCategories();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [cardsToRepeat, setCardsToRepeat] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const categoryCards = cards.filter(w => w.categoryId === categoryId);



    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await initializeCategories();
            setIsLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!isLoading && categoryId && categories.length > 0) {
            const currentCategory = categories.find(c => c._id === categoryId);
            if (currentCategory) {
                loadCategoryCards(categoryId);
            }
        }
    }, [categoryId, categories, isLoading]);

    if (isLoading) {
        return <div><LoadingSpinner /></div >
    }

    const category = categories.find(c => c._id === categoryId);
    if (!category) {
        return <div className={styles.not_found}>Категория не найдена</div>
    }

    const handleAddCard = async (frontside: string, backside: string, hintImageUrl?: string) => {
        if (!categoryId) {
            toast.error('Category Id is missing');
            return;
        }

        try {
            await addCard(frontside, backside, categoryId, hintImageUrl);
            toast.success('Карточка успешно создана');
            await loadCategoryCards(categoryId);
        } catch (error: any) {
            error.response?.data?.message || 'Failed to create card';
            toast.error(error);
            console.error('Create card error:', error)
        }
    };

    const handleStartRepeat = () => {
        const count = parseInt(cardsToRepeat);
        if (count > 0 && count <= categoryCards.length) {
            const selectedCards = categoryCards.slice(0, count).map(card => ({
                id: card._id,
                frontside: card.frontside,
                backside: card.backside,
                totalShows: card.totalShows,
                correctAnswers: card.correctAnswers,
                hintImageUrl: card.hintImageUrl
            }));
            navigate(`/review/${categoryId}`, {
                state: {
                    cards: selectedCards,
                    cardsToRepeat: count,
                }
            });
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
                        {categoryCards.map(card => (
                            <WordCard
                                key={card._id}
                                frontside={card.frontside}
                                backside={card.backside}
                                isEditing={isEditing}
                                hintImageUrl={card.hintImageUrl}
                                onDelete={() => removeCard(card._id)}
                                onEdit={(frontside, backside, hintImageUrl) => updateCard(card._id, frontside, backside, hintImageUrl)}
                            />
                        ))}
                    </ul>
                    <div className={styles.repeat_container}>
                        <p className={styles.subtitle}>Карточек в категории: {categoryCards.length}</p>
                        <p className={styles.repeat_title}>Сколько карточек повторим?</p>
                        <input
                            className={styles.repeat_input}
                            type='number'
                            min='1'
                            max={categoryCards.length}
                            value={cardsToRepeat}
                            onChange={(e) => setCardsToRepeat(e.target.value)}
                        />
                        <Button
                            text='Начать'
                            width='large'
                            onClick={handleStartRepeat}
                            disabled={!cardsToRepeat || categoryCards.length === 0}
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
