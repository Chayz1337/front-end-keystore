// src/components/ui/modal/AdminPasswordModal.tsx
import { FC, useState, FormEvent } from 'react';
import { useAdminAuth } from '@/src/components/ui/admin/AdminAuthContext'; // Adjust path
import styles from './AdminCode.module.scss'; // You'll need to create/style this

interface AdminPasswordModalProps {
  // No explicit props needed as it uses context
}

const AdminPasswordModal: FC<AdminPasswordModalProps> = () => {
  const { isPasswordModalOpen, closePasswordModal, verifyAdminAccess } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (verifyAdminAccess(password)) {
      setError('');
      setPassword(''); // Clear password field
      // Modal will be closed by context
    } else {
      setError('Неверный код администратора.');
    }
  };

  if (!isPasswordModalOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Вход в панель администратора</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="admin-password">Код администратора:</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className={styles.inputField} // Add styling
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={closePasswordModal} className={styles.buttonSecondary}>
              Отмена
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;