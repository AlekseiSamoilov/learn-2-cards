import React from 'react'
import styles from './category.module.css'
import { useNavigate } from 'react-router-dom';

interface ICategoryProps {
    onDelete?: () => void;
    title: string;
    id: string;

}

const Category: React.FC<ICategoryProps> = ({ title, onDelete, id }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/category${id}`);
    };

    return (
        <div className={styles.container} onClick={handleClick}>
            <h3 className={styles.title}>{title}</h3>
            {onDelete && (
                <button
                    className={styles.delete_button}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >✖</button>
            )}
        </div>
    )
}

export default Category
