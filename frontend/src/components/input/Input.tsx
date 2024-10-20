import styles from './input.module.css'


export default function Input(title: string) {
    return (
        <div>
            <label className={styles.label}>{title}</label>
            <input></input>
        </div>
    )
}
