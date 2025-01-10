import React from 'react'
import styles from './button.module.css'

export interface IButtonProps {
    text?: string;
    onClick?: (e: React.FormEvent) => void;
    width?: 'small' | 'medium' | 'large' | 'full';
    disabled?: boolean;
    answer?: 'correct' | 'incorrect';

}
const Button: React.FC<IButtonProps> = ({ text, width = '300px', onClick, disabled, answer }) => {

    const getWidthClass = () => {
        switch (width) {
            case 'small': return styles.width_small;
            case 'medium': return styles.width_medium;
            case 'large': return styles.width_large;
            case 'full': return styles.width_full;
            default: return styles.width_medium;
        }
    }


    const getAnswerClass = () => {
        switch (answer) {
            case 'correct': return styles.correct;
            case 'incorrect': return styles.incorrect;
            default: return '';
        }
    }
    return (
        <div>
            <button onClick={onClick} disabled={disabled} className={`${styles.button} ${getWidthClass()} ${getAnswerClass()}`}>{text}</button>
        </div >
    )
}

export default Button
