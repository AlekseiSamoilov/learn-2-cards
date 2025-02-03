import React, { useState } from 'react'
import styles from './add-word-form.module.css'
import Input from '../input/Input';
import Button from '../button/Button';

interface IAddWordFormProps {
    onSubmit: (frontside: string, backside: string, imageUrl?: string) => void;
    onCancel: () => void;
    initialValues?: {
        frontside: string;
        backside: string;
        imageUrl?: string;
    };
    isEditing?: boolean;
}

const AddWordForm: React.FC<IAddWordFormProps> = ({ onSubmit, onCancel, initialValues }) => {
    const [frontside, setFrontside] = useState<string>(initialValues?.frontside || '');
    const [backside, setBackside] = useState<string>(initialValues?.backside || '');
    const [imageUrl, setImageUrl] = useState<string>(initialValues?.imageUrl || '');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (frontside.trim() && backside.trim()) {
            onSubmit(frontside, backside, imageUrl);
            setFrontside('');
            setBackside('');
            setImageUrl('')
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <Input
                title='Лицевая сторона'
                value={frontside}
                onChange={(e) => setFrontside(e.target.value)}
                placeholder='Введите слово'
                multiline={true}
                rows={3}
                required
            />
            <Input
                title='Обратная сторона'
                value={backside}
                onChange={(e) => setBackside(e.target.value)}
                placeholder='Введите обратную сторону'
                required
                multiline={true}
                rows={3}
                color='blue'
            />
            <Input
                title='Ссылка на картинку'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder='Введите ссылку на картинку-подсказку'

            />
            <div className={styles.form_buttons}>
                <Button text='Добавить' width='medium' disabled={frontside.length === 0 || backside.length === 0} />
                <Button text='Отмена' onClick={onCancel} width='medium' />
            </div>
        </form>
    )
}

export default AddWordForm
