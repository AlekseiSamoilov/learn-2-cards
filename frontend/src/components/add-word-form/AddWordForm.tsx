import React, { useState } from 'react'
import styles from './add-word-form.module.css'
import Input from '../input/Input';
import Button from '../button/Button';

interface IAddWordFormProps {
    onSubmit: (frontside: string, backside: string, hintImageUrl?: string) => void;
    onCancel: () => void;
    initialValues?: {
        frontside: string;
        backside: string;
        hintImageUrl: string;
    };
    isEditing?: boolean;
}

const AddWordForm: React.FC<IAddWordFormProps> = ({ onSubmit, onCancel, initialValues, isEditing = false }) => {
    const [frontside, setFrontside] = useState<string>(initialValues?.frontside || '');
    const [backside, setBackside] = useState<string>(initialValues?.backside || '');
    const [hintImageUrl, setHintImageUrl] = useState<string>(initialValues?.hintImageUrl || '');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (frontside.trim() && backside.trim()) {
            onSubmit(frontside, backside, hintImageUrl);
            setFrontside('');
            setBackside('');
            setHintImageUrl('')
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
            <Input
                title='Ссылка на картинку'
                value={hintImageUrl}
                onChange={(e) => setHintImageUrl(e.target.value)}
                placeholder='Введите ссылку на картинку-подсказку'
            />
            <div className={styles.form_buttons}>
                <Button text='Добавить' width='medium' />
                <Button text='Отмена' onClick={onCancel} width='medium' />
            </div>
        </form>
    )
}

export default AddWordForm
