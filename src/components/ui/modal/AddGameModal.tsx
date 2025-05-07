import { FC, useState } from 'react';
import Modal from '@/src/components/ui/modal/Modal'; // Используй общий Modal компонент
import { ProductService } from '@/src/assets/styles/services/product/product.service';
import styles from './AddGameModal.module.scss'; // Импортируем стили

interface IAddGameModal {
  isOpen: boolean;
  closeModal: () => void;
}

const AddGameModal: FC<IAddGameModal> = ({ isOpen, closeModal }) => {
  const [gameData, setGameData] = useState({
    name: '',
    description: '',
    price: 0,
    images: [''],
    categories: [] as number[],
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setGameData({ ...gameData, price: Number(value) });
    } else {
      setGameData({ ...gameData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameData({ ...gameData, images: [e.target.value] });
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const categoryIds = e.target.value
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));
    setGameData({ ...gameData, categories: categoryIds });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameData.name || !gameData.description || !gameData.images[0] || !gameData.categories.length) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      await ProductService.create({
        ...gameData,
        price: Number(gameData.price),
        categories: gameData.categories.map(Number),
      });
      alert('Игра успешно добавлена!');
      closeModal();
      setGameData({
        name: '',
        description: '',
        price: 0,
        images: [''],
        categories: [],
      });
      setError('');
    } catch (error) {
      console.error('Ошибка при добавлении игры:', error);
      setError('Ошибка при добавлении игры');
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className={`${styles.modalWindow}`}>
        <h2 className="text-xl font-semibold text-center">Добавить игру</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={gameData.name}
            onChange={handleChange}
            placeholder="Название игры"
            className={styles.formInput}
          />
          <textarea
            name="description"
            value={gameData.description}
            onChange={handleChange}
            placeholder="Описание игры"
            className={`${styles.formInput} ${styles.textArea}`}
          />
          <input
            type="number"
            name="price"
            value={gameData.price}
            onChange={handleChange}
            placeholder="Цена"
            className={styles.formInput}
            min={0}
          />
          <input
            type="text"
            name="images"
            value={gameData.images[0]}
            onChange={handleImageChange}
            placeholder="URL изображения"
            className={styles.formInput}
          />
          <input
            type="text"
            name="categories"
            value={gameData.categories.join(', ')}
            onChange={handleCategoriesChange}
            placeholder="ID категорий (через запятую)"
            className={styles.formInput}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className={styles.submitButton}
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddGameModal;
