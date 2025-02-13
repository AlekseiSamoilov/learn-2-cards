import React, { useEffect, useRef, useState } from 'react'
import styles from './category.module.css'
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { GripVertical } from "lucide-react"

interface ICategoryProps {
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    title: string;
    id: string;
    cardsCount: number;
    index: number;
}

const Category: React.FC<ICategoryProps> = ({ title, onDelete, onEdit, id, cardsCount, index }) => {
    const [dragging, setDragging] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            element: el,
            onDragStart: () => setDragging(true),
            onDrop: () => setDragging(false),
            getInitialData: () => ({
                id,
                index: Number(index),
            })
        });
    }, [id, index]);

    const handleClick = () => {
        navigate(`/category/${id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(id)
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(id);
        }
    };

    return (
        <motion.div className={`${styles.container} ${dragging ? styles.drag : ""}`} ref={ref}>
            <motion.div className={styles.main_content}>
                <motion.div className={styles.info_container} onClick={handleClick}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.cards_count}>{`Карточек: ${cardsCount}`}</p>
                </motion.div>


            </motion.div>
            <AnimatePresence mode='wait'>
                {onDelete && (
                    <motion.div layout
                        className={styles.edit_container}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                    >
                        <button className={styles.delete_button}
                            onClick={handleEditClick}
                        >Изменить</button>
                        <button
                            className={styles.delete_button}
                            onClick={handleDeleteClick}
                        >Удалить</button>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div className={styles.grip_handle}>
                <GripVertical size={20} />
            </motion.div>
        </motion.div >
    )
}

export default Category
