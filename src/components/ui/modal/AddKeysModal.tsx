import { FC, useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from 'react';
import styles from './AddKeysModal.module.scss';
import { RiCloseLine } from 'react-icons/ri';

interface IAddKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (keys: string[]) => void;
}

const AddKeysModal: FC<IAddKeysModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const modalContentRef = useRef<HTMLDivElement | null>(null); // Ref для контента модального окна

  // Эффект для обработки клика вне модального окна и нажатия Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalClick = (event: MouseEvent) => { // Используем global MouseEvent
      if (!modalContentRef.current) return;

      const target = event.target as HTMLElement;

      // 1. Клик внутри контента модалки? Если да, ничего не делаем.
      if (modalContentRef.current.contains(target)) {
        return;
      }

      // 2. (Опционально, если у тебя внутри этой модалки есть react-select или другие портальные элементы)
      //    Проверка на клик внутри меню react-select или других порталов.
      //    Если таких элементов нет, этот блок можно упростить или убрать.
      let currentElement: HTMLElement | null = target;
      let clickedInsidePortalElement = false;
      while (currentElement) {
        // Пример для react-select (добавь другие классы, если нужно)
        if (currentElement.classList &&
            (currentElement.classList.contains('react-select__menu') ||
             currentElement.classList.contains('react-select__menu-list') ||
             currentElement.classList.contains('react-select__option'))
           ) {
          clickedInsidePortalElement = true;
          break;
        }
        // Можно добавить проверку на другие портальные элементы, если они используются
        // Например, по ID или специальным data-атрибутам
        // if (document.getElementById('some-portal-id')?.contains(currentElement)) {
        //   clickedInsidePortalElement = true;
        //   break;
        // }
        currentElement = currentElement.parentElement;
      }

      if (clickedInsidePortalElement) {
        return;
      }
      
      // Если клик был не внутри контента и не внутри портального элемента, закрываем.
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Используем 'mousedown' вместо 'click' для закрытия по клику вне,
    // чтобы обработать ситуацию, когда пользователь начинает тянуть мышь изнутри модалки наружу.
    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]); // Зависимости


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

  // НЕ НУЖЕН: handleOverlayClick - логика теперь в useEffect/handleGlobalClick
  // НЕ НУЖЕН: handleModalContentClick - логика теперь в useEffect/handleGlobalClick

  return (
    // Оверлей теперь не нуждается в собственном onClick для закрытия,
    // так как это обрабатывается глобальным слушателем на document.
    <div className={styles.modalOverlay}>
      {/* Передаем ref на основной блок контента модального окна */}
      <div className={styles.modal} ref={modalContentRef}>
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

