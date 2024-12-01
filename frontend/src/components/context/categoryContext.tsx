import { createContext, useContext, useState } from "react";
import { ICategory, IWord } from "../../types/types";

interface ICategoryContext {
    categories: ICategory[];
    words: IWord[];
    addCategory: (title: string) => void;
    removeCategory: (id: string) => void;
    addWord: (categoryId: string, frontside: string, backside: string, hintImageUrl?: string) => void;
    removeWord: (id: string) => void;
    updateWord: (wordId: string, frontside: string, backside: string, hintImageUrl?: string) => void;
}

const CategoryContext = createContext<ICategoryContext | undefined>(undefined);
export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [words, setWords] = useState<IWord[]>([]);

    const addCategory = (title: string) => {
        const newCategory: ICategory = {
            id: Date.now().toString(),
            title
        };
        setCategories([...categories, newCategory]);
    };

    const removeCategory = (id: string) => {
        setCategories(categories.filter(cat => cat.id !== id));
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