import { useEffect, useState } from 'react';
import { TValidationRule } from '../../types/validationRule';
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
    multiline?: boolean;
    rows?: number;
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
    type = 'text',
    multiline = false,
    rows = 3,
}) => {

    const [localError, setLocalError] = useState<string>('');

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

    const handleChange = (e: any) => {
        onChange?.(e);
        validateInput(e.target.value);
    }

    useEffect(() => {
        if (value) {
            validateInput(value);
        }
    }, []);

    return (
        <div className={styles.container}>
            <label className={styles.label}>{title}</label>
            {multiline ? (
                <textarea
                    value={value}
                    placeholder={placeholder}
                    className={`${styles.input} ${styles.textarea}`}
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