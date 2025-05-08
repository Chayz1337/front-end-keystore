import { FC, PropsWithChildren, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react'; // Используем ReactMouseEvent для onClick
import ReactDOM from 'react-dom';
import { RiCloseFill } from 'react-icons/ri'; // Убедись, что react-icons установлены
import styles from './Modal.module.scss';

interface IModal {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: FC<PropsWithChildren<IModal>> = ({ children, isOpen, closeModal }) => {
  const modalRootRef = useRef<HTMLElement | null>(null); // Переименовал для ясности, что это ref на DOM-элемент
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Убедимся, что #modal существует в DOM
    const modalElement = document.getElementById('modal');
    if (modalElement) {
      modalRootRef.current = modalElement;
    } else {
      // Если #modal нет, можно его создать и добавить в body,
      // или вывести ошибку, если он должен быть создан заранее.
      console.warn('Элемент с ID "modal" не найден в DOM. Модальное окно может не работать корректно.');
      // Как запасной вариант, можно рендерить в document.body, если #modal не найден.
      // modalRootRef.current = document.body;
    }
  }, []);

  useEffect(() => {
    // Обработчик для document, чтобы отлавливать клики где угодно
    const handleGlobalClick = (event: globalThis.MouseEvent) => { // Используем globalThis.MouseEvent для document
      if (!isOpen || !contentRef.current) return;

      const target = event.target as HTMLElement;

      // 1. Клик внутри контента модалки? Если да, ничего не делаем.
      if (contentRef.current.contains(target)) {
        return;
      }

      // 2. Клик внутри меню react-select?
      //    react-select рендерит меню в портале, обычно в body.
      //    Мы ищем элементы с классами, которые использует react-select для своего меню.
      //    Если classNamePrefix="react-select" (по умолчанию или явно указан),
      //    то меню будет иметь класс react-select__menu, а опции react-select__option.
      let currentElement: HTMLElement | null = target;
      let clickedInsideSelectMenu = false;
      while (currentElement) {
        if (currentElement.classList &&
            (currentElement.classList.contains('react-select__menu') || // Само меню
             currentElement.classList.contains('react-select__menu-list') || // Список внутри меню
             currentElement.classList.contains('react-select__option') || // Опция меню
             currentElement.classList.contains('react-select__control') // Если клик по самому селекту, тоже не закрывать
            )
           ) {
          clickedInsideSelectMenu = true;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (clickedInsideSelectMenu) {
        return; // Клик внутри react-select, ничего не делаем.
      }
      
      // Если клик был не внутри контента модалки и не внутри меню react-select,
      // то закрываем модальное окно.
      closeModal();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleGlobalClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [isOpen, closeModal]); // Зависимости contentRef.current не нужны, т.к. он стабилен после первого рендера

  // Если модалка не открыта или корневой элемент для портала не найден, ничего не рендерим
  if (!isOpen || !modalRootRef.current) {
    return null;
  }

  return ReactDOM.createPortal(
    // Убираем onClick с оверлея, т.к. логика теперь в handleGlobalClick
    <div className={styles.overlay} /* onClick НЕ НУЖЕН ЗДЕСЬ */> 
      <div className={styles.window} ref={contentRef}>
        <button onClick={closeModal} className={styles.closeButton} aria-label="Закрыть модальное окно">
          <RiCloseFill size={24} />
        </button>
        {children}
      </div>
    </div>,
    modalRootRef.current
  );
};

export default Modal;