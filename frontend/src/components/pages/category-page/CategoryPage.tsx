import { useEffect, useState } from 'react';
import styles from './category-page.module.css';
import Button from '../../button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../context/categoryContext';
import AddWordForm from '../../add-word-form/AddWordForm';
import WordCard from '../../wordCard/WordCard';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../loading-spinner/LoadingSpinner';
import CardSelectionService from '../../../api/services/cardsSelection.service';
import ConfirmModal from '../../confitm-modal/ConfirmModal';

const CategoryPage = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const { categories, cards, addCard, removeCard, updateCard, loadCategoryCards, initializeCategories } = useCategories();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [cardsToRepeat, setCardsToRepeat] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const categoryCards = cards.filter(w => w.categoryId === categoryId);

    const cardSelectionService = new CardSelectionService();

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
        } finally {
            setShowAddForm(false);
        }
    };

    const handleStartRepeat = () => {
        const count = parseInt(cardsToRepeat);
        if (count > 0 && count <= categoryCards.length) {
            const selectedCards: any = [];

            const remainingCards = [...categoryCards];

            while (selectedCards.length < count && remainingCards.length > 0) {
                const nextCard = cardSelectionService.getNextCard(remainingCards);
                if (nextCard) {
                    selectedCards.push({
                        _id: nextCard._id,
                        frontside: isFlipped ? nextCard.backside : nextCard.frontside,
                        backside: isFlipped ? nextCard.frontside : nextCard.backside,
                        totalShows: nextCard.totalShows,
                        correctAnswers: nextCard.correctAnswers,
                        imageUrl: nextCard.imageUrl
                    });

                    const index = remainingCards.findIndex(card => card._id === nextCard._id);
                    if (index > -1) {
                        remainingCards.splice(index, 1);
                    }
                }
            }
            navigate(`/review/${categoryId}`, {
                state: {
                    cards: selectedCards,
                    cardsToRepeat: count,
                    categoryTitle: category.title,
                }
            });
        }
    };

    const hadnleStartRepeatAll = () => {
        if (categoryCards.length > 0) {
            const selectedCards = [];
            const remainingCards = [...categoryCards];

            while (remainingCards.length > 0) {
                const nextCard = cardSelectionService.getNextCard(remainingCards);
                if (nextCard) {
                    selectedCards.push({
                        _id: nextCard._id,
                        frontside: nextCard.frontside,
                        backside: nextCard.backside,
                        totalShows: nextCard.totalShows,
                        correctAnswers: nextCard.correctAnswers,
                        imageUrl: nextCard.imageUrl
                    });
                    const index = remainingCards.findIndex(card => card._id === nextCard._id);
                    if (index > -1) {
                        remainingCards.splice(index, 1);
                    }
                }
            }

            navigate(`/review/${categoryId}`, {
                state: {
                    cards: selectedCards,
                    cardsToRepeat: categoryCards.length,
                    categoryTitle: category.title,
                }
            });
        }
    };

    const handleDeleteClick = (cardId: string) => {
        setCardToDelete(cardId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (cardToDelete) {
            await removeCard(cardToDelete);
            setCardToDelete(null);
            setIsDeleteModalOpen(false);
            setIsEditing(false);
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.header_container}>
                <h1 className={styles.title}>{category.title}</h1>
                {!showAddForm && (
                    <div className={styles.buttons}>
                        <button className={styles.edit_button}
                            onClick={() => navigate('/main')}><svg stroke="black" fill="black" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"></path></svg></button>
                        {!showAddForm && (
                            <button className={styles.edit_button}
                                onClick={() => setShowAddForm(true)}
                            ><svg stroke="black" fill="black" stroke-width="0" viewBox="0 0 16 16" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 1h12l.5.5v12l-.5.5h-12l-.5-.5v-12l.5-.5zM2 13h11V2H2v11z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4H7v3H4v1h3v3h1V8h3V7H8V4z"></path></svg></button>
                        )}
                        <button onClick={() => setIsEditing(!isEditing)} className={styles.edit_button}>{isEditing ?
                            <svg stroke="black" fill="black" stroke-width="0" viewBox="0 0 24 24" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                            :
                            <svg stroke="black" fill="black" stroke-width="0" viewBox="0 0 16 16" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"></path></svg>

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
                                id={card._id}
                                frontside={card.frontside}
                                backside={card.backside}
                                isEditing={isEditing}
                                imageUrl={card.imageUrl}
                                onDelete={handleDeleteClick}
                                onEdit={(frontside, backside, imageUrl?) => updateCard(card._id, frontside, backside, imageUrl)}
                                totalSHows={card.totalShows}
                                correctAnswers={card.correctAnswers}
                            />
                        ))}
                    </ul>
                    <div className={styles.gradient_bot}></div>
                    <p className={styles.subtitle}>Карточек в категории: {categoryCards.length}</p>
                    <div className={styles.repeat_container}>
                        <div className={styles.how_much}>
                            <label className={styles.repeat_title}>Сколько карточек повторим?</label>
                            <input
                                className={styles.repeat_input}
                                type='number'
                                min='1'
                                max={categoryCards.length}
                                value={cardsToRepeat}
                                onChange={(e) => setCardsToRepeat(e.target.value)}
                            />
                            <div className={styles.checkbox_box}>
                                <label className={styles.repeat_checkbox}>Поменять стороны</label>
                                <input
                                    type='checkbox'
                                    className={styles.flip_checkbox}
                                    checked={isFlipped}
                                    onChange={(e) => setIsFlipped(e.target.checked)}
                                />
                            </div>
                        </div>
                        <div className={styles.btn_box}>
                            <Button
                                text='Начать'
                                width='medium'
                                onClick={handleStartRepeat}
                                disabled={!cardsToRepeat || categoryCards.length === 0 || categoryCards.length < Number(cardsToRepeat)}
                            />
                            <Button
                                text='Все сразу!'
                                width='medium'
                                onClick={hadnleStartRepeatAll}
                                disabled={categoryCards.length === 0}
                            />
                        </div>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title='Удаление карточки'
                message='Вы уверены, что хотите удалить эту карточку?'
                confirmText='Удалить'
                cancelText='Отмена'
            />
        </div>
    )
}

export default CategoryPage
