// src/components/screens/auth/Auth.tsx
import { FC, useEffect, useState } from "react";
import Meta from "@/src/components/ui/Meta";
import Button from "@/src/components/ui/button/Button";
import Heading from "@/src/components/ui/button/Heading";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";
import { SubmitHandler, useForm } from "react-hook-form";
import Field from "@/src/components/ui/input/Field";
import Spinner from "@/src/components/ui/input/Spinner";
import { validEmail } from "./valid-email";
import { useAuthRedirect } from "./useAuthRedirect";
import { IEmailPassword } from "@/src/store/user/user.interface";
import { useRouter } from "next/router";

// Импортируем иконки
import { FcGoogle } from 'react-icons/fc'; // Иконка Google
import { FaGithub } from 'react-icons/fa'; // Иконка GitHub

// Конфигурация URL'ов для OAuth и восстановления пароля
const GOOGLE_AUTH_URL = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || '/api/auth/google';
const GITHUB_AUTH_URL = process.env.NEXT_PUBLIC_GITHUB_AUTH_URL || '/api/auth/github';
const FORGOT_PASSWORD_PAGE_URL = '/forgot-password';

const errorMap: Record<string, string> = {
  "Invalid password": "Неверный пароль 🔒 Пожалуйста, попробуйте ещё раз.",
  "User not found": "Пользователь не найден 😕 Зарегистрируйтесь или проверьте почту.",
  "Invalid email": "Неверный формат почты 📧",
  // здесь можно добавить другие кейсы...
};

const Auth: FC = () => {
  useAuthRedirect();
  const router = useRouter();

  const { isLoading, error } = useAuth();
  const { login, register: registerAction } = useActions();
  const [type, setType] = useState<"Вход" | "Регистрация">("Вход");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IEmailPassword>({ mode: "onChange" });

  const onSubmit: SubmitHandler<IEmailPassword> = (data) => {
    if (type === "Вход") login(data);
    else registerAction(data);
  };

  useEffect(() => {
    reset();
  }, [type, reset]);

  const friendlyError = error ? (errorMap[error] || error) : null;

  return (
    <Meta title="Авторизация">
      <section className="flex h-screen">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl bg-while shadow-sm p-10 m-auto w-full max-w-md"
        >
          <Heading classname="capitalize text-center mb-4">{type}</Heading>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <>
              <Field
                {...formRegister("email", {
                  required: "Пожалуйста, введите почту",
                  pattern: {
                    value: validEmail,
                    message: "Введите корректный email-адрес",
                  },
                })}
                placeholder="Почта"
                error={errors.email?.message}
              />

              <Field
                {...formRegister("password", {
                  required: "Введите пароль",
                  minLength: { value: 6, message: "Пароль не менее 6 символов" },
                })}
                type="password"
                placeholder="Пароль"
                error={errors.password?.message}
              />

              {friendlyError && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {friendlyError}
                </div>
              )}

              <div className="mt-6 flex flex-col items-center">
                <Button type="submit" variant="orange" className="w-full sm:w-auto">
                  {type === "Вход" ? "Войти" : "Зарегистрироваться"}
                </Button>

                <button
                  type="button"
                  className="inline-block opacity-50 hover:opacity-75 mt-4 text-sm transition-opacity"
                  onClick={() => setType(type === "Вход" ? "Регистрация" : "Вход")}
                >
                  {type === "Вход"
                    ? "Нет аккаунта? Зарегистрироваться"
                    : "Есть аккаунт? Войти"}
                </button>

                {/* Кнопка "Забыли пароль?" только для формы входа */}
                {type === "Вход" && (
                  <button
                    type="button"
                    className="inline-block opacity-50 hover:opacity-75 mt-2 text-sm transition-opacity"
                    onClick={() => router.push(FORGOT_PASSWORD_PAGE_URL)}
                  >
                    Забыли пароль? Восстановить
                  </button>
                )}

                {/* Разделитель перед социальными входами с новым текстом */}
                <div className="text-center my-4 opacity-70">Или войти через:</div>

                {/* Блок для социальных кнопок (иконок) */}
                <div className="flex justify-center gap-4 w-full">
                  {/* Google Login как иконка */}
                  <a
                    href={GOOGLE_AUTH_URL}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Войти через Google"
                  >
                    <FcGoogle size={28} /> {/* Размер иконки */}
                  </a>

                  {/* GitHub Login как иконка */}
                  <a
                    href={GITHUB_AUTH_URL}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-while border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                    aria-label="Войти через GitHub"
                  >
                    <FaGithub size={28} /> {/* Размер иконки */}
                  </a>
                </div>
              </div>
            </>
          )}
        </form>
      </section>
    </Meta>
  );
};

export default Auth;