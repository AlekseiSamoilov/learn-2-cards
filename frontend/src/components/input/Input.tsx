import styles from './input.module.css'

interface IInputProps {
    title: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export default function Input({ title, placeholder }: IInputProps) {

    return (
        <div className={styles.container}>
            <label className={styles.label}>{title}</label>
            <input placeholder={placeholder} className={styles.input}></input>
        </div>
    )
}
