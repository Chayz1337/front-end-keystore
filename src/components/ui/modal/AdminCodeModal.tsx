// src/components/ui/modal/AdminPasswordModal.tsx
import { FC, useState, FormEvent } from 'react';
import { useAdminAuth } from '@/src/components/ui/admin/AdminAuthContext';
import styles from './AdminCode.module.scss'

const AdminPasswordModal: FC = () => {
  const {
    isPasswordModalOpen,
    closePasswordModal,
    verifyAdminAccess,
    errorMessage
  } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await verifyAdminAccess(password);
    setLoading(false);
    if (success) setPassword('');
  };

  if (!isPasswordModalOpen) return null;

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
              className={styles.inputField}
            />
          </div>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={closePasswordModal}
              className={styles.buttonSecondary}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading ? 'Проверка...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordModal;
