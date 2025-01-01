import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ICategory } from "../../api/types/category.types";
import { categoryService } from "../../api/services/category.service";
import { toast } from "react-toastify";
import { ICard } from "../../api/types/card.types";
import { cardService } from "../../api/services/card.service";

interface ICategoryContext {
    categories: ICategory[];
    cards: ICard[];
    isLoading: boolean;
    error: string | null;
    initializeCategories: () => Promise<void>;
    addCategory: (title: string) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
    updateCategory: (id: string, title: string) => Promise<void>;
    addCard: (categoryId: string, frontside: string, backside: string, imageUrl?: string) => Promise<ICard>;
    loadCategoryCards: (categoryId: string) => Promise<void>;
    removeCard: (id: string) => void;
    updateCard: (id: string, frontside: string, backside: string, imageUrl?: string) => Promise<void>;
}

const CategoryContext = createContext<ICategoryContext | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [cards, setCards] = useState<ICard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const initializeCategories = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            setIsLoading(true);
            setError(null);
            const fetchedCategories = await categoryService.getAllCategories();
            setCategories(fetchedCategories);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setCategories([]);
                return;
            }
            const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
            setError(errorMessage)
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeCategories();
    }, []);

    const addCategory = async (title: string) => {
        try {
            setIsLoading(true);
            console.log(`categories controller logs:`, title)
            setError(null);
            const newCategory = await categoryService.createCategory({ title });
            setCategories(prev => [...prev, newCategory]);
            console.log(categories)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create category';
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeCategory = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await categoryService.deleteCategory(id);
            setCategories(prev => prev.filter(cat => cat._id !== id));
            setCards(prev => prev.filter(card => card.categoryId !== id));
            toast.success('Категория успешно удалена');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete category';
            setError(errorMessage);
            toast.error(errorMessage)
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCategory = async (id: string, title: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedCategory = await categoryService.updateCategory(id, { title });
            console.log('Updated category from CategoryContext:', updatedCategory)
            setCategories(prev => prev.map(cat => cat._id === id ? updatedCategory : cat));
            toast.success('Категория успешно обновлена');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update category';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const addCard = async (frontside: string, backside: string, categoryId: string, imageUrl?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const newCard = await cardService.createCard({ frontside, backside, imageUrl: imageUrl }, categoryId);
            setCards(prev => [...prev, newCard]);
            return newCard;
        } catch (error: any) {
            const errorMessage = error.reponse?.data?.message || 'Fail to create card';
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategoryCards = async (categoryId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            if (!categoryId) {
                console.error('No category ID provided');
                return;
            }

            console.log('Loading cards for category: ', categoryId)
            const categoryCards = await cardService.getCardsByCategory(categoryId);
            setCards(categoryCards);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to load cards';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const removeCard = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            console.log(id)
            await cardService.deleteCard(id);
            setCards(prev => prev.filter(card => card._id !== id));
            toast.success('Карточка успешно удалена');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete card';
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCard = async (cardId: string, frontside: string, backside: string, imageUrl?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const updatedCard = await cardService.updateCard(cardId, {
                frontside,
                backside,
                imageUrl,
            });
            console.log('Updated card from CategoryContext', updatedCard)
            setCards(prev => prev.map(card => card._id === cardId ? updatedCard : card));
            toast.success('Карточка успешно обновлена');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update card';
            setError(errorMessage);
            toast.error(errorMessage)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CategoryContext.Provider value={{
            categories,
            cards,
            isLoading,
            error,
            initializeCategories,
            addCategory,
            removeCategory,
            updateCategory,
            addCard,
            removeCard,
            updateCard,
            loadCategoryCards
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
}