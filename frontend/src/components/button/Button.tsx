import React from 'react'
import styles from './button.module.css'

export interface IButtonProps {
    text?: string;
    onClick?: (e: React.FormEvent) => void
}
const Button: React.FC<IButtonProps> = ({ text }) => {
    return (
        <div>
            <button className={styles.button}>{text}</button>
        </div >
    )
}

export default Button
