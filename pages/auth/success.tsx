// src/pages/auth/success.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useActions } from '@/src/hooks/user.actions'; // Твой хук useActions
 // Путь к твоему auth.helper
import Spinner from '@/src/components/ui/input/Spinner'; // Твой компонент Spinner
import { IUser, IAuthResponse } from '@/src/store/user/user.interface'; // Импорты интерфейсов
import { removeFromStorage, saveToStorage } from '@/src/assets/styles/services/auth/auth.helper';
import { axiosWithAuth } from '@/src/assets/styles/api/api.interceptor';
// Твой настроенный axios instance

const AuthSuccessPage = () => {
  const router = useRouter();
  const { setAuthStateFromOAuth } = useActions(); // Используем экшен из Redux
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { accessToken, refreshToken } = router.query;

    const handleAuth = async () => {
      setIsLoading(true);
      setError(null);

      if (accessToken && refreshToken && typeof accessToken === 'string' && typeof refreshToken === 'string') {
        try {
          const initialAuthData: IAuthResponse = {
            user: {} as IUser, // Временно, будет перезаписано
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          saveToStorage(initialAuthData); // Сохраняем, чтобы axiosWithAuth мог подхватить токен

          let currentUser: IUser;
          try {
            // ИСПОЛЬЗУЕМ ТВОЙ ЭНДПОИНТ /api/users/profile
            const response = await axiosWithAuth.get<IUser>('/users/profile'); 
            currentUser = response.data;
          } catch (fetchUserError: any) {
            console.error('Failed to fetch user profile after OAuth:', fetchUserError);
            setError('Не удалось получить данные профиля пользователя. Попробуйте войти снова.');
            removeFromStorage(); 
            setIsLoading(false);
            return;
          }
          
          const finalAuthData: IAuthResponse = {
            user: currentUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
          saveToStorage(finalAuthData);

          if (setAuthStateFromOAuth) {
            setAuthStateFromOAuth(finalAuthData);
          } else {
            console.error("setAuthStateFromOAuth action is not defined in useActions!");
            setError('Ошибка конфигурации приложения (setAuthStateFromOAuth).');
            setIsLoading(false);
            return;
          }
          
          router.push('/'); 
        } catch (e: any) {
          console.error('Error processing OAuth callback:', e);
          setError('Произошла ошибка при обработке аутентификации.');
          removeFromStorage();
          setIsLoading(false);
        }
      } else if (router.query.error) {
        console.error('OAuth Error on client:', router.query.error, router.query.reason);
        setError(`Ошибка аутентификации: ${router.query.reason || router.query.error}. Пожалуйста, попробуйте войти снова.`);
        setIsLoading(false);
      } else if (router.isReady && Object.keys(router.query).length > 0 && (!accessToken || !refreshToken)) {
        console.warn('OAuth Success page loaded with incomplete query params:', router.query);
        setError('Неполные данные для аутентификации. Попробуйте войти снова.');
        setIsLoading(false);
      } else if (!router.isReady) {
        return;
      } else {
        setError('Неверная страница аутентификации. Пожалуйста, начните процесс входа заново.');
        setIsLoading(false);
      }
    };

    if (router.isReady) {
        handleAuth();
    }

  }, [router.isReady, router.query, router, setAuthStateFromOAuth]); 

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Spinner />
        <p style={{ marginLeft: '10px', marginTop: '10px' }}>Завершение аутентификации...</p>
      </div>
    );
  }
  
  if (error) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
            <h1>Ошибка аутентификации</h1>
            <p style={{ color: 'red', margin: '20px 0', maxWidth: '400px' }}>{error}</p>
            <button 
              onClick={() => router.push('/login')} 
              style={{
                padding: '10px 20px', 
                cursor: 'pointer', 
                border: '1px solid #ccc', 
                borderRadius: '5px',
                backgroundColor: '#f0f0f0',
                marginTop: '10px'
              }}
            >
              Вернуться на страницу входа
            </button>
        </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Spinner />
      <p style={{ marginLeft: '10px', marginTop: '10px' }}>Перенаправление...</p>
    </div>
  ); 
};

export default AuthSuccessPage;