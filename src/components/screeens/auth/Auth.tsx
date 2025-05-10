import { FC, useState } from "react";
import Meta from '@/src/components/ui/Meta';
import Button from "../../ui/button/Button";
import Heading from "../../ui/button/Heading";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";
import { SubmitHandler, useForm } from "react-hook-form";
import { IEmailPassword } from "@/src/store/user/user.interface";
import Field from "../../ui/input/Field";
import { validEmail } from "./valid-email";
import Spinner from "../../ui/input/Spinner";
import { useAuthRedirect } from "./useAuthRedirect";

const Auth: FC = () => {
    useAuthRedirect();
    
    const { isLoading } = useAuth();
    const { login, register: registerAction } = useActions(); // Переименовал register в registerAction, чтобы не конфликтовать с formRegister
    const [type, setType] = useState<'Вход' | 'Регистрация'>('Вход');

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IEmailPassword>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IEmailPassword> = data => {
        if (type === 'Вход') { // Строгое сравнение
            login(data);
        } else {
            registerAction(data); // Используем переименованную функцию
        }
        reset();
    };

    return (
        <Meta title='Auth'>
            <section className='flex h-screen'>
                {/* Исправлена опечатка bg-while -> bg-white */}
                <form onSubmit={handleSubmit(onSubmit)} className='rounded-3xl bg-while shadow-sm p-10 m-auto w-full max-w-md'> {/* Добавил w-full max-w-md для лучшего вида формы */}
                    <Heading classname='capitalize text-center mb-4'>{type}</Heading> {/* Исправил classname на className */}
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40"> {/* Обертка для Spinner */}
                           <Spinner />
                        </div>
                    ) : (
                        <>
                            <Field
                                {...formRegister('email', {
                                    required: 'Пожалуйста, введите почту',
                                    pattern: {
                                        value: validEmail,
                                        message: 'Пожалуйста введите верный email-адрес.',
                                    },
                                })}
                                placeholder='Почта'
                                error={errors.email?.message}
                            />

                            <Field
                                {...formRegister('password', {
                                    required: 'Введите ваш пароль',
                                    minLength: { value: 6, message: 'Минимальная длина пароля 6 символов' },
                                })}
                                type='password'
                                placeholder='Пароль'
                                error={errors.password?.message}
                            />
                            
                            {/* Обертка для центрирования кнопок */}
                            <div className="mt-6 flex flex-col items-center"> {/* Добавил mt-6 для отступа сверху */}
                                <Button type='submit' variant='orange' className="w-full sm:w-auto"> {/* Добавил w-full sm:w-auto для адаптивности кнопки */}
                                    {/* Динамический текст кнопки */}
                                    {type === 'Вход' ? 'Войти' : 'Зарегистрироваться'} 
                                </Button>
                                
                                <button 
                                    type='button' 
                                    className='inline-block opacity-50 hover:opacity-75 mt-4 text-sm transition-opacity' // Улучшил стиль кнопки переключения
                                    onClick={() => setType(type === 'Вход' ? 'Регистрация' : 'Вход')}
                                >
                                    {type === 'Вход' ? 'Создать аккаунт (Регистрация)' : 'Уже есть аккаунт? (Вход)'}
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