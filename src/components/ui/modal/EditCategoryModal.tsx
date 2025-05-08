import { FC, useState, useEffect } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import styles from './EditCategoryModal.module.scss';
import { CategoryService } from '@/src/assets/styles/services/category.service';

interface IEditCategoryModal {
  isOpen: boolean;
  categoryId: number | null;
  initialName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCategoryModal: FC<IEditCategoryModal> = ({
  isOpen,
  categoryId,
  initialName,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  // Сбросим поле при каждом открытии
  useEffect(() => {
    setName(initialName);
    setError('');
  }, [initialName, isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Название не может быть пустым');
      return;
    }
    try {
      await CategoryService.update(categoryId!, name.trim());
      onSuccess();
      onClose();
    } catch {
      setError('Ошибка при обновлении');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      <div className={styles.modalWindow}>
        <h2 className={styles.title}>Редактировать категорию</h2>

        {error && <p className={styles.errorText}>{error}</p>}

        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите новое название"
        />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Отмена
          </button>
          <button onClick={handleSubmit} className={styles.submitBtn}>
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;
