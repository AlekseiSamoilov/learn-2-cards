import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWord } from "../../types/types";
import { ICategory } from "../../api/types/category.types";
import { categoryService } from "../../api/services/category.service";
import { toast } from "react-toastify";
import { ICard } from "../../api/types/card.types";
import { cardService } from "../../api/services/card.service";

interface ICategoryContext {
    categories: ICategory[];
    words: IWord[];
    isLoading: boolean;
    error: string | null;
    initializeCategories: () => Promise<void>;
    addCategory: (title: string) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
    updateCategory: (id: string, title: string) => Promise<void>;
    addCard: (categoryId: string, frontside: string, backside: string, hintImageUrl?: string) => Promise<void>;
    removeWord: (id: string) => void;
    updateWord: (wordId: string, frontside: string, backside: string, hintImageUrl?: string) => void;
}

const CategoryContext = createContext<ICategoryContext | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [cards, setCards] = useState<ICard[]>([]);
    const [words, setWords] = useState<IWord[]>([]);
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

    const addCategory = async (title: string) => {
        try {
            setIsLoading(true);
            console.log(`categories controller logs:`, title)
            setError(null);
            const newCategory = await categoryService.createCategory({ title });
            setCategories(prev => [...prev, newCategory]);
            console.log(categories)
            toast.success('Категория успешно создана');
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
            setWords(prev => prev.filter(word => word.categoryId !== id));
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

    // const addCategory = async (title: string) => {
    //     try {
    //         setIsLoading(true);
    //         setError(null);
    //         const newCategory = await categoryService.createCategory({ title });
    //         setCategories(prev => [...prev, newCategory]);
    //         console.log(categories)
    //         toast.success('Категория успешно создана');
    //     } catch (error: any) {
    //         const errorMessage = error.response?.data?.message || 'Failed to create category';
    //         setError(errorMessage);
    //         toast.error(errorMessage);
    //         throw error;
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const addCard = async (id: string, frontside: string, backside: string, hintImageUrl?: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const newCard = await cardService.createCard({ id, frontside, backside });
            setCards(prev => [...prev, newCard]);
            console.log(cards);
            toast.success('Карточка успешно создана');
        } catch (error: any) {
            const errorMessage = error.reponse?.data?.message || 'Fail to create card';
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeWord = (id: string) => {
        setWords(words.filter(word => word.id !== id));
    };

    const updateWord = (wordId: string, frontside: string, backside: string, hintImageUrl?: string) => {
        setWords(words.map(word => word.id === wordId ? { ...word, frontside, backside, hintImageUrl } : word));
    };

    return (
        <CategoryContext.Provider value={{
            categories,
            words,
            isLoading,
            error,
            initializeCategories,
            addCategory,
            removeCategory,
            updateCategory,
            addCard,
            removeWord,
            updateWord
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