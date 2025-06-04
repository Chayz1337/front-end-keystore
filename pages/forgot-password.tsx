// src/pages/forgot-password.tsx

import { FC, useState } from 'react';
import Meta from '@/src/components/ui/Meta';
import Button from '@/src/components/ui/button/Button';
import Heading from '@/src/components/ui/button/Heading';
import Field from '@/src/components/ui/input/Field';
import { SubmitHandler, useForm } from 'react-hook-form';

import Spinner from '@/src/components/ui/input/Spinner';
import { axiosClassic } from '@/src/assets/styles/api/api.interceptor';
import { validEmail } from '@/src/components/screeens/auth/valid-email';

interface IForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<IForgotPasswordForm>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<IForgotPasswordForm> = async (data) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await axiosClassic.post(
        '/auth/forgot-password', // Эндпоинт на бэкенде
        data
      );
      setMessage(response.data.message || 'Письмо для сброса пароля отправлено.');
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка. Попробуйте снова.');
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Meta title="Восстановление пароля">
      <section className="flex h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl bg-while shadow-sm p-10 m-auto w-full max-w-md"
        >
          <Heading classname="text-center mb-4">Восстановление пароля</Heading>

          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Spinner />
            </div>
          ) : (
            <>
              <p className="text-center text-sm mb-4">
                Введите email, связанный с вашим аккаунтом, и мы отправим вам ссылку для сброса пароля.
              </p>
              <Field
                {...formRegister('email', {
                  required: 'Пожалуйста, введите почту',
                  pattern: {
                    value: validEmail,
                    message: 'Введите корректный email-адрес',
                  },
                })}
                placeholder="Почта"
                error={formErrors.email?.message}
                type="email"
              />

              {message && (
                <div className="text-green-600 text-sm mt-2 text-center">
                  {message}
                </div>
              )}
              {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col items-center">
                <Button type="submit" variant="orange" className="w-full sm:w-auto">
                  Отправить ссылку
                </Button>
              </div>
            </>
          )}
        </form>
      </section>
    </Meta>
  );
};

export default ForgotPasswordPage;