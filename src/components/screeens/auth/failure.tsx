// src/pages/auth/failure.tsx

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AuthFailurePage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('Произошла ошибка во время аутентификации.');

  useEffect(() => {
    if (router.query.error) {
      // Можно добавить более специфичные сообщения на основе router.query.reason, если бэкенд его передает
      switch (router.query.reason) {
        case 'TokenGenerationError':
          setErrorMessage('Не удалось сгенерировать токен аутентификации. Попробуйте снова.');
          break;
        case 'UserFetchError':
          setErrorMessage('Не удалось получить данные пользователя от провайдера. Попробуйте снова.');
          break;
        default:
          setErrorMessage(`Ошибка аутентификации: ${router.query.error}. Пожалуйста, попробуйте снова.`);
      }
    }
  }, [router.query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
      <h1>Ошибка аутентификации</h1>
      <p style={{ color: 'red', margin: '20px 0' }}>{errorMessage}</p>
      <Link href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
        Вернуться на страницу входа
      </Link>
    </div>
  );
};

export default AuthFailurePage;