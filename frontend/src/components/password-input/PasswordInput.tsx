import { useState } from "react";
import Input, { IInputProps } from "../input/Input";
import styles from './passwordInput.module.css'

interface IPasswordInputProps extends IInputProps {
    confirm?: boolean;
    compareWith?: string;
}

const PasswordInput: React.FC<IPasswordInputProps> = ({
    title,
    value,
    onChange,
    placeholder,
    confirm = false,
    compareWith = ''
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const passwordRules = [
        {
            validate: (value: string) => value.length >= 6,
            errorMessage: 'Пароль должен быть не менее 6 символов'
        },
    ];

    const confirmRules = [
        {
            validate: (value: string) => value === compareWith,
            errorMessage: 'Пароли не совпадают'
        },
    ];

    return (
        <div className={styles.password_container}>
            <Input
                title={title}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
                validationRules={confirm ? confirmRules : passwordRules}
                required
            />
            <button
                className={styles.toggle_button}
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? 'Спрятать' : 'Показать'}</button>
        </div>
    )
}

export default PasswordInput;