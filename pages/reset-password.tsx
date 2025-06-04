// src/pages/reset-password.tsx

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Meta from '@/src/components/ui/Meta';
import Button from '@/src/components/ui/button/Button';
import Heading from '@/src/components/ui/button/Heading';
import Field from '@/src/components/ui/input/Field';
import { SubmitHandler, useForm } from 'react-hook-form';

import Spinner from '@/src/components/ui/input/Spinner';
import { axiosClassic } from '@/src/assets/styles/api/api.interceptor';

interface IResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token as string);
    } else if (Object.keys(router.query).length > 0 && !router.query.token) {
        setError('Токен для сброса пароля не найден в URL. Пожалуйста, запросите ссылку снова.');
    }
  }, [router.query]);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
    reset,
  } = useForm<IResetPasswordForm>({ mode: 'onChange' });

  const newPassword = watch('password');

  const onSubmit: SubmitHandler<IResetPasswordForm> = async (data) => {
    if (!token) {
      setError('Токен недействителен.');
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axiosClassic.post(
        '/auth/reset-password', // Эндпоинт на бэкенде
        { token, password: data.password } // Отправляем токен и новый пароль
      );
      setMessage(response.data.message || 'Пароль успешно сброшен! Теперь вы можете войти с новым паролем.');
      reset();
      setTimeout(() => {
        router.push('/auth'); // Редирект на страницу входа через 3 секунды
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка. Попробуйте снова.');
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error && Object.keys(router.query).length > 0) {
    // Если токен еще не загрузился из query, но есть query, показываем загрузку
    // (если query пуст, то useEffect должен был бы установить ошибку или мы ждем токена)
    return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner />
         </div>
    )
  }


  return (
    <Meta title="Сброс пароля">
      <section className="flex h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl bg-while shadow-sm p-10 m-auto w-full max-w-md"
        >
          <Heading classname="text-center mb-4">Установка нового пароля</Heading>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : message ? (
             <div className="text-green-600 text-lg mt-2 text-center p-4">
                {message}
             </div>
          ) : error ? (
             <div className="text-red-500 text-lg mt-2 text-center p-4">
                {error}
                {error.includes("Токен") && (
                     <Button
                        variant="orange"
                        onClick={() => router.push('/forgot-password')}
                        className="mt-4 text-blue-600 hover:underline"
                     >
                        Запросить новую ссылку
                     </Button>
                )}
             </div>
          ) : token ? ( // Показываем форму только если есть токен и нет сообщения об успехе/ошибке
            <>
              <Field
                {...formRegister('password', {
                  required: 'Введите новый пароль',
                  minLength: { value: 6, message: 'Пароль не менее 6 символов' },
                })}
                type="password"
                placeholder="Новый пароль"
                error={formErrors.password?.message}
              />
              <Field
                {...formRegister('confirmPassword', {
                  required: 'Подтвердите новый пароль',
                  validate: (value) =>
                    value === newPassword || 'Пароли не совпадают',
                })}
                type="password"
                placeholder="Подтвердите пароль"
                error={formErrors.confirmPassword?.message}
              />
              <div className="mt-6 flex flex-col items-center">
                <Button type="submit" variant="orange" className="w-full sm:w-auto">
                  Сбросить пароль
                </Button>
              </div>
            </>
          ) : (
            // Если токена нет и ошибки нет (начальное состояние без токена в URL, но страница загружена)
            // Это состояние может возникнуть если пользователь напрямую открыл /reset-password
             <div className="text-red-500 text-sm mt-2 text-center">
                Неверная или отсутствующая ссылка для сброса пароля.
             </div>
          )}
        </form>
      </section>
    </Meta>
  );
};

export default ResetPasswordPage;