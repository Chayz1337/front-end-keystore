import { FC, useState } from 'react';
import styles from './AddKeysModal.module.scss';
import { RiCloseLine } from 'react-icons/ri';

interface IAddKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (keys: string[]) => void;
}

const AddKeysModal: FC<IAddKeysModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const keys = text
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keys.length > 0) {
      onSubmit(keys);
      setText('');
      onClose();
    } else {
      alert('Введите хотя бы один ключ');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Добавить ключи</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <RiCloseLine size={24} />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Один ключ на строку"
          className={styles.textarea}
        />
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddKeysModal;
