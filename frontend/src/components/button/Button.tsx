import React from 'react'
import styles from './button.module.css'

export interface IButtonProps {
    text?: string;
    onClick?: (e: React.FormEvent) => void;
    width?: '100px' | '150px' | '300px' | 'full';

}
const Button: React.FC<IButtonProps> = ({ text, width = '300px', onClick }) => {

    const getWidthClass = () => {
        switch (width) {
            case '100px': return styles.width_small;
            case '150px': return styles.width_medium;
            case '300px': return styles.width_large;
            case 'full': return styles.width_full;
            default: return styles.width_medium;
        }
    }
    return (
        <div>
            <button onClick={onClick} className={`${styles.button} ${getWidthClass()}`}>{text}</button>
        </div >
    )
}

export default Button
