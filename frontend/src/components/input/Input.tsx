import { useEffect, useState } from 'react';
import { TValidationRule } from '../../types/validation';
import styles from './input.module.css'
import { AnimatePresence, motion } from "framer-motion";

export interface IInputProps {
    title: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    validationRules?: TValidationRule[];
    error?: string;
    required?: boolean;
}

const Input: React.FC<IInputProps> = ({
    title,
    value,
    onChange,
    validationRules = [],
    error,
    placeholder,
    required = false,
    type = 'text'
}) => {

    const [localError, setLocalError] = useState<string>('');
    const [isDirty, setIsDirty] = useState(false);


    const validateInput = (value: string) => {

        if (required && value.trim() === '') {
            setLocalError('Поле обязательно для заполнения');
            return false;
        }

        if (!required && value.trim() === '') {
            setLocalError('');
            return false;
        }

        for (const rule of validationRules) {
            if (!rule.validate(value)) {
                setLocalError(rule.errorMessage);
                return false;
            }
        }
        setLocalError('');
        return true;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        validateInput(e.target.value);
        setIsDirty(true);
    }

    useEffect(() => {
        if (value) {
            validateInput(value);
        }
    }, []);

    const handleBlur = () => {
        setIsDirty(true);
        if (value) {
            validateInput(value);
        }
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>{title}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                className={styles.input}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <AnimatePresence mode="popLayout" initial={false}>
                {(localError || error) && (
                    <motion.span
                        className={styles.errorMessage}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                    >{localError || error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Input