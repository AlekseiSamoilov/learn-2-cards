import React, { useState } from 'react'
import styles from './add-word-form.module.css'
import Input from '../input/Input';
import Button from '../button/Button';

interface IAddWordFormProps {
    onSubmit: (frontside: string, backside: string) => void;
    onCancel: () => void;
}

const AddWordForm: React.FC<IAddWordFormProps> = ({ onSubmit, onCancel }) => {
    const [frontside, setFrontside] = useState<string>('');
    const [backside, setBackside] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (frontside.trim() && backside.trim()) {
            onSubmit(frontside, backside);
            setFrontside('');
            setBackside('');
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <Input
                title='Слово'
                value={frontside}
                onChange={(e) => setFrontside(e.target.value)}
                placeholder='Введите слово'
                required
            />
            <Input
                title='Обратная сторона'
                value={backside}
                onChange={(e) => setBackside(e.target.value)}
                placeholder='Введите обратную сторону'
                required
            />
            <div className={styles.form_buttons}>
                <Button text='Добавить' width='medium' />
                <Button text='Отмена' onClick={onCancel} width='medium' />
            </div>
        </form>
    )
}

export default AddWordForm
