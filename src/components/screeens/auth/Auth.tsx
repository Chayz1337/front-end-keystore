import { FC, useState } from "react"
import Meta from '@/src/components/ui/Meta'
import Button from "../../ui/button/Button"
import Heading from "../../ui/button/Heading"
import { useAuth } from "@/src/hooks/useAuth"
import { useActions } from "@/src/hooks/user.actions"
import { SubmitHandler, useForm } from "react-hook-form"
import { IEmailPassword } from "@/src/store/user/user.interface"
import Field from "../../ui/input/Field"
import { validEmail } from "./valid-email"
import Spinner from "../../ui/input/Spinner"
import { useAuthRedirect } from "./useAuthRedirect"

const Auth: FC = () => {

    useAuthRedirect()
    
    const {isLoading} = useAuth()
    const {login, register} = useActions()
    const [type, setType] = useState<'Вход' | 'Регистрация'> ('Вход')

    const {register: formRegister,
         handleSubmit,
          formState: {errors},
           reset} = useForm <IEmailPassword> ({
        mode: "onChange"
    })
    const onSubmit: SubmitHandler<IEmailPassword> = data => {
        if (type == 'Вход') {
            login(data)
        }
        else {
            register(data)
        }
        reset()
    }
    return <Meta title = 'Auth'>
        <section className='flex h-screen'>
        <form onSubmit={handleSubmit(onSubmit)} className='rounded-lg bg-while shadow-sm p-8 m-auto'>
        <Heading classname='capitalize text-center mb-4'>{type}</Heading>
        {isLoading ? <Spinner /> :<>
            <Field {...formRegister('email', {required: 'Пожалуйста, введите почту', 
                pattern: {
                    value: validEmail,
                    message: 'Пожалуйста введите верный email-адрес.'
                }
            })}
        placeholder = 'Почта'
        error= {errors.email?.message}/>

            <Field {...formRegister('password', {required: 'Введите ваш пароль',  minLength: { value: 6, message: 'Минимальная длина пароля 6 символов'}
                    })}
        type='password'
        placeholder = 'Пароль'
        error= {errors.password?.message}/>
        <Button type = 'submit' variant='orange'>Войти</Button>  </>}
        <div>
        <button type = 'button' className = 'inline-block opacity-40 mt-3 text-sm shadow-sm' onClick={()=>
             setType(type == 'Вход'? 'Регистрация': 'Вход')}> {type ==
                             'Вход'? 'Регистрация': 'Вход'}</button>
             </div>
        </form>
        </section>  
    </Meta>
}
export default Auth