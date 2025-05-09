// src/components/ui/modal/Modal.tsx
'use client'; // Если используется в Next.js App Router

import { FC, PropsWithChildren, useRef, useEffect, useState, MouseEvent as ReactMouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { RiCloseFill } from 'react-icons/ri';
import styles from './Modal.module.scss'; // Твои стили с анимацией из Modal.module.scss

interface IModal {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: FC<PropsWithChildren<IModal>> = ({ children, isOpen, closeModal }) => {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null); // Ref для div.window

  // Устанавливаем узел для портала один раз после монтирования компонента
  useEffect(() => {
    console.log('[Modal.tsx] Component did mount, attempting to find portal root.');
    const modalElement = document.getElementById('modal');
    if (modalElement) {
      console.log('[Modal.tsx] Found #modal element for portal.');
      setPortalNode(modalElement);
    } else {
      console.warn('[Modal.tsx] Элемент с ID "modal" не найден в DOM. Используется document.body для портала.');
      setPortalNode(document.body); // Запасной вариант
    }
  }, []); // Пустой массив зависимостей, выполняется один раз

  // Эффект для обработки кликов вне модалки и Escape, а также блокировки скролла
  useEffect(() => {
    console.log('[Modal.tsx] useEffect for isOpen changed. isOpen:', isOpen);
    if (!isOpen) {
      document.body.style.overflow = ''; // Восстанавливаем прокрутку, если модалка закрыта
      return;
    }

    const handleGlobalClick = (event: globalThis.MouseEvent) => {
      if (!contentRef.current) return;

      const target = event.target as HTMLElement;

      // Клик внутри контента модалки?
      if (contentRef.current.contains(target)) {
        // console.log('[Modal.tsx] Click inside modal content.');
        return;
      }

      // Клик внутри портальных элементов (например, react-select)
      let currentElement: HTMLElement | null = target;
      let clickedInsidePortalElement = false;
      while (currentElement) {
        if (currentElement.classList &&
            (currentElement.classList.contains('react-select__menu') ||
             currentElement.classList.contains('react-select__menu-list') ||
             currentElement.classList.contains('react-select__option') ||
             currentElement.classList.contains('react-select__control') 
            )
           ) {
          // console.log('[Modal.tsx] Click inside react-select.');
          clickedInsidePortalElement = true;
          break;
        }
        currentElement = currentElement.parentElement;
      }

      if (clickedInsidePortalElement) {
        return;
      }
      
      // console.log('[Modal.tsx] Click outside modal content and known portals. Closing modal.');
      closeModal();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // console.log('[Modal.tsx] Escape key pressed. Closing modal.');
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона при открытой модалке

    // Очистка слушателей и стилей
    return () => {
      // console.log('[Modal.tsx] Cleaning up event listeners and body overflow.');
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeModal]); // Перезапускаем эффект при изменении isOpen или closeModal

  console.log('[Modal.tsx] Render check: isOpen =', isOpen, 'portalNode =', !!portalNode);

  // Не рендерим, если модалка не открыта или узел портала еще не установлен
  if (!isOpen || !portalNode) {
    if (!isOpen) console.log('[Modal.tsx] Not rendering: isOpen is false.');
    if (!portalNode) console.log('[Modal.tsx] Not rendering: portalNode is null.');
    return null;
  }

  console.log('[Modal.tsx] Rendering portal...');
  return ReactDOM.createPortal(
    <div className={styles.overlay}> 
      <div className={styles.window} ref={contentRef}> {/* contentRef на .window */}
        <button 
            onClick={closeModal} 
            className={styles.closeButton} 
            aria-label="Закрыть модальное окно"
            type="button" // Важно для кнопок не в форме
        >
          <RiCloseFill size={20} /> {/* Размер иконки можно настроить */}
        </button>
        {children}
      </div>
    </div>,
    portalNode // Используем узел из состояния
  );
};

export default Modal;