import React, { useState } from 'react'
import Input from '../../input/Input'
import PasswordInput from '../../password-input/PasswordInput';
import styles from './registration-page.module.css'
import Button from '../../button/Button';
import { createConfirmPasswordRules, loginValidationRules, passwordValidationRules } from '../../utils/validation-rules';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function RegistrationPage() {
    const navigate = useNavigate();
    const { register, error, isLoading } = useAuth();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [formError, setFormError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (password !== confirmPassword) {
            setFormError('Пароли не совпадают');
            return;
        };

        try {
            console.log('Attempting registration with:', { login, password });
            const response = await register({ login, password, displayName: displayName.trim() || login });
            console.log('Registration response:', response);
            if (response?.user?.recoveryCode) {
                navigate('/recovery-code', {
                    state: { recoveryCode: response.user.recoveryCode }
                });
            } else {
                console.log('Missing recovery code in response:', response);
            }
        } catch (err) {
            console.error('Ошибка регистрации', err)
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Регистрация</h1>
            <Input
                onChange={(e) => setLogin(e.target.value)}
                value={login}
                title='Введите логин'
                placeholder='Введите логин, от 4 до 10 символов'
                validationRules={loginValidationRules}
                required
            />

            <Input
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                title='Как вас называть?'
                placeholder='Введите имя для отображения'
            />
            <PasswordInput
                title='Пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Введите пароль, от 6 до 10 символов'
                validationRules={passwordValidationRules}
                required
            />
            <PasswordInput
                title='Введите пароль еще раз'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Повторите введенный пароль'
                validationRules={createConfirmPasswordRules(password)}
                required
            />
            {formError && (
                <div className={styles.error_message}>{formError}</div>
            )}
            <Button width='large' onClick={handleSubmit} text={isLoading ? 'Загрузка' : 'Далее'} disabled={isLoading || password !== confirmPassword} />
        </div>
    )
}
