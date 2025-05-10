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

const errorMap: Record<string, string> = {
  "Invalid password": "Неверный пароль 🔒 Пожалуйста, попробуйте ещё раз.",
  "User not found": "Пользователь не найден 😕 Зарегистрируйтесь или проверьте почту.",
  "Invalid email": "Неверный формат почты 📧",
  // здесь можно добавить другие кейсы...
};

const Auth: FC = () => {
  useAuthRedirect();

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
    // не сбрасываем форму сразу, чтобы пользователь видел ошибку, если она случится
  };

  // при смене режима сбрасываем форму и ошибку
  useEffect(() => {
    reset();
    // можно сбросить ошибку через экшен clearAuthError()
  }, [type, reset]);

  // переводим backend-ошибку в приятный текст
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
              </div>
            </>
          )}
        </form>
      </section>
    </Meta>
  );
};

export default Auth;
