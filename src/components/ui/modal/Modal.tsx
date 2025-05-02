import { FC, PropsWithChildren, useRef, useEffect, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { RiCloseFill } from 'react-icons/ri';
import styles from './Modal.module.scss';

interface IModal {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: FC<PropsWithChildren<IModal>> = ({ children, isOpen, closeModal }) => {
  const modalRoot = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    modalRoot.current = document.getElementById('modal');
  }, []);

  // Закрытие по клику вне окна
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  if (!isOpen || !modalRoot.current) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.window} ref={contentRef}>
        <button onClick={closeModal} className={styles.closeButton}>
          <RiCloseFill size={24} />
        </button>
        {children}
      </div>
    </div>,
    modalRoot.current
  );
};

export default Modal;
