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

    const handleAddCard = async (frontside: string, backside: string, imageUrl?: string) => {
        if (!categoryId) {
            toast.error('Category Id is missing');
            return;
        }

        try {
            await addCard(frontside, backside, categoryId, imageUrl);
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
                _id: card._id,
                frontside: card.frontside,
                backside: card.backside,
                totalShows: card.totalShows,
                correctAnswers: card.correctAnswers,
                imageUrl: card.imageUrl
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
            <div className={styles.header_container}>
                <h1 className={styles.title}>{category.title}</h1>
                {!showAddForm && (
                    <div className={styles.buttons}>
                        <button className={styles.edit_button}
                            onClick={() => navigate('/main')}><svg stroke="#136147cc" fill="#136147cc" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg></button>
                        {!showAddForm && (
                            <button className={styles.edit_button}
                                onClick={() => setShowAddForm(true)}
                            ><svg stroke="currentColor" fill="#136147cc" stroke-width="0" viewBox="0 0 16 16" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 7H3V4H0V3h3V0h1v3h3v1H4v3zm6.5-5.9l3.4 3.5.1.4v8.5l-.5.5h-10l-.5-.5V8h1v5h9V6H9V2H5V1h5.2l.3.1zM10 2v3h2.9L10 2z"></path></svg></button>
                        )}
                        <button onClick={() => setIsEditing(!isEditing)} className={styles.edit_button}>{isEditing ?
                            <svg stroke="#136147cc" fill="#136147cc" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                            :
                            <svg stroke="#136147cc" fill="#136147cc" stroke-width="0" viewBox="0 0 16 16" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"></path></svg>

                        }
                        </button>
                    </div>
                )
                }

            </div>


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
                                imageUrl={card.imageUrl}
                                onDelete={() => removeCard(card._id)}
                                onEdit={(frontside, backside, imageUrl?) => updateCard(card._id, frontside, backside, imageUrl)}
                            />
                        ))}
                    </ul>
                    <p className={styles.subtitle}>Карточек в категории: {categoryCards.length}</p>
                    <div className={styles.repeat_container}>
                        <div className={styles.how_much}>
                            <p className={styles.repeat_title}>Сколько карточек повторим?</p>
                            <input
                                className={styles.repeat_input}
                                type='number'
                                min='1'
                                max={categoryCards.length}
                                value={cardsToRepeat}
                                onChange={(e) => setCardsToRepeat(e.target.value)}
                            />
                        </div>
                        <Button
                            text='Начать'
                            width='large'
                            onClick={handleStartRepeat}
                            disabled={!cardsToRepeat || categoryCards.length === 0}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default CategoryPage
