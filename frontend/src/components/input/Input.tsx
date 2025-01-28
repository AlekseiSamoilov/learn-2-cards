import { useState } from 'react';
import { TValidationRule } from '../../types/validationRule';
import styles from './input.module.css'
import { AnimatePresence, motion } from "framer-motion";

export interface IInputProps {
    title: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    className?: string;
    validationRules?: TValidationRule[];
    error?: string;
    multiline?: boolean;
    rows?: number;
    required?: boolean;
    color?: 'black' | 'blue';
}

const Input: React.FC<IInputProps> = ({
    title,
    value = '',
    onChange,
    validationRules = [],
    error,
    placeholder,
    required = false,
    type = 'text',
    multiline = false,
    rows = 3,
    color = 'black',
}) => {

    const [localError, setLocalError] = useState<string>('');

    const validateInput = (value: string | undefined) => {

        const valueToValidate = value ?? '';

        if (required && valueToValidate.trim() === '') {
            setLocalError('Поле обязательно для заполнения');
            return false;
        }

        if (!required && valueToValidate.trim() === '') {
            setLocalError('');
            return false;
        }

        for (const rule of validationRules) {
            if (!rule.validate(valueToValidate)) {
                setLocalError(rule.errorMessage);
                return false;
            }
        }
        setLocalError('');
        return true;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange?.(e);
        validateInput(newValue);
    }

    const handleBlur = () => {
        validateInput(value);
    }

    const getColorClass = () => {
        switch (color) {
            case 'blue': return styles.blue_font;
            case 'black': return styles.blue_black;
            default: return styles.black_font;
        }
    }

    return (
        <div className={styles.container}>
            <label className={styles.label}>{title}</label>
            {multiline ? (
                <textarea
                    value={value}
                    placeholder={placeholder}
                    className={`${styles.input} ${styles.textarea} ${getColorClass()}`}
                    onChange={handleChange}
                    rows={rows}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    className={styles.input}
                    onChange={handleChange}
                    onBlur={handleBlur}

                />
            )}

            <div className={styles.error_container}>
                <AnimatePresence mode="popLayout" initial={true}>
                    {(localError || error) && (
                        <motion.span
                            className={styles.errorMessage}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
                        >{localError || error}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

        </div>
    )
}

export default Input