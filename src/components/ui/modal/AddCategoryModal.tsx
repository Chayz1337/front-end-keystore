import { FC, useEffect } from 'react';
import Modal from '@/src/components/ui/modal/Modal';
import { useForm } from 'react-hook-form';
import { CategoryService } from '@/src/assets/styles/services/category.service';
import styles from './EditCategoryModal.module.scss';

interface IAddCategoryModal {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
}

const AddCategoryModal: FC<IAddCategoryModal> = ({ isOpen, onClose, onSuccess }) => {
  // Используем react-hook-form для управления состоянием формы и валидации
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { name: '' }
  });

  // Сброс значений формы при открытии модалки
  useEffect(() => {
    if (isOpen) {
      reset({ name: '' });
    }
  }, [isOpen, reset]);

  // Обработчик отправки формы
  const onSubmit = async (data: FormData) => {
    try {
      // Создаем категорию через сервис
      await CategoryService.create(data.name.trim());
      onSuccess(); // обновить список категорий
      onClose();   // закрыть модалку
    } catch (err) {
      console.error('Ошибка при создании категории:', err);
    }
  };

  // Если модалка не открыта, не рендерим ничего
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} closeModal={onClose}>
      <div className={`${styles.modalWindow} p-6`}>
        <h2 className={`${styles.title} mb-4`}>Создать категорию</h2>

        {/* Ошибки валидации */}
        {errors.name && <p className={`${styles.errorText} mb-4`}>{errors.name.message}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            className={`${styles.input} mb-4 p-2`}
            {...register('name', {
              required: 'Название категории обязательно',
              minLength: {
                value: 3,
                message: 'Название должно содержать хотя бы 3 символа'
              }
            })}
            placeholder="Введите название категории"
          />

          <div className={`${styles.actions} flex justify-between mt-4`}>
            <button type="button" onClick={onClose} className={`${styles.cancelBtn} p-2`}>
              Отмена
            </button>
            <button
              type="submit"
              className={`${styles.submitBtn} p-2`}
              disabled={isSubmitting}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;
