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
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={styles.password_container}>
            <Input
                title={title}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={showPassword ? 'text' : 'password'}
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