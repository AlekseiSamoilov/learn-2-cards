import React from 'react'
import styles from './category.module.css'

interface ICategoryProps {
    onClick: () => void;
    title: string;

}

const Category: React.FC<ICategoryProps> = ({ title, onClick }) => {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{title}</h3>
        </div>
    )
}

export default Category
