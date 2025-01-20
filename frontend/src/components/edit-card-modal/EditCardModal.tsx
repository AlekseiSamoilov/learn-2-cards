import AddWordForm from '../add-word-form/AddWordForm';
import Modal from '../modal/modal';
import React from 'react'

interface IEditWordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (frontside: string, backside: string, imageUrl?: string) => void;
    initialValues: {
        frontside: string;
        backside: string;
        imageUrl?: string;
    };
}

const EditCardModal: React.FC<IEditWordModalProps> = ({
    isOpen,
    onClose,
    onEdit,
    initialValues
}) => {

    const handleSubmit = (frontside: string, backside: string, imageUrl?: string) => {
        onEdit(frontside, backside, imageUrl);
        onClose();
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Редактировать карточку"
            size='small'
        >
            <AddWordForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                initialValues={initialValues}
                isEditing={true}
            />
        </Modal>
    );
};

export default EditCardModal
