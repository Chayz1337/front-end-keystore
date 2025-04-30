import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import cn from 'clsx'

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
variant: 'orange' | 'white'
}

const Button: FC<PropsWithChildren<IButton>> = 
({children,
    className,
    variant,
     ...rest}) => {
        return <div className='flex justify-center'>
  <button {...rest} className={cn('rounded-xl font-semibold shadow-md px-14 py-2 m-2 hover:shadow-lg transition duration-300 ease-in-out', {
            'text-while bg-primary': variant == 'orange',
            'text-primary bg-while': variant == 'white',
        }, className)}>
            {children}
        </button>
    </div>;
}
export default Button