import { createContext, useContext, useEffect, useState } from "react";
import { IWord } from "../../types/types";
import { ICategory } from "../../api/types/category.types";
import { categoryService } from "../../api/services/category.service";

interface ICategoryContext {
    categories: ICategory[];
    words: IWord[];
    isLoading: boolean;
    error: string | null;
    addCategory: (title: string) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
    addWord: (categoryId: string, frontside: string, backside: string, hintImageUrl?: string) => void;
    removeWord: (id: string) => Promise<void>;
    updateWord: (wordId: string, frontside: string, backside: string, hintImageUrl?: string) => void;
}

const CategoryContext = createContext<ICategoryContext | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [words, setWords] = useState<IWord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [erro, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedCategories = await categoryService.getAllCaegories();
            setCategories(fetchedCategories);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const addCategory = (title: string) => {
        const newCategory: ICategory = {
            _id: Date.now().toString(),
            title
        };
        setCategories([...categories, newCategory]);
    };

    const removeCategory = (id: string) => {
        setCategories(categories.filter(cat => cat._id !== id));
        setWords(words.filter(word => word.categoryId !== id));
    };

    const addWord = (categoryId: string, frontside: string, backside: string, hintImageUrl?: string) => {
        const newWord: IWord = {
            id: Date.now().toString(),
            frontside,
            backside,
            categoryId,
            hintImageUrl,
            totalShows: 0,
            correctAnswers: 0,
        };
        setWords([...words, newWord]);
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
            addCategory,
            removeCategory,
            addWord,
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