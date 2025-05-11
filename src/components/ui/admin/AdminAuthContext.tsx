// src/components/ui/admin/AdminAuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import Cookies from 'js-cookie';

interface AdminAuthContextType {
  isAdminVerified: boolean;
  isPasswordModalOpen: boolean;
  errorMessage: string | null;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
  verifyAdminAccess: (password: string) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

const ADMIN_VERIFIED_KEY = 'isAdminAccessVerified';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_VERIFIED_KEY);
    setIsAdminVerified(stored === 'true');
  }, []);

  const openPasswordModal = () => {
    setErrorMessage(null);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setErrorMessage(null);
  };

  const verifyAdminAccess = async (password: string) => {
    const token = Cookies.get('accessToken');
    if (!token) {
      setErrorMessage('Требуется авторизация.');
      return false;
    }

    try {
      const res = await fetch(
        'http://localhost:4200/api/admin/management/verify-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ password })
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.verified) {
          sessionStorage.setItem(ADMIN_VERIFIED_KEY, 'true');
          setIsAdminVerified(true);
          setErrorMessage(null);
          setIsPasswordModalOpen(false);
          return true;
        } else {
          setErrorMessage('Неверный код администратора.');
        }
      } else if (res.status === 400) {
        const data = await res.json();
        setErrorMessage(
          Array.isArray(data.message) ? data.message[0] : data.message
        );
      } else {
        setErrorMessage('Ошибка сервера. Попробуйте позже.');
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('Ошибка сети. Проверьте подключение.');
    }

    return false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminVerified,
        isPasswordModalOpen,
        errorMessage,
        openPasswordModal,
        closePasswordModal,
        verifyAdminAccess
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
};
