// src/components/ui/button/Button.tsx
import { ButtonHTMLAttributes, FC, PropsWithChildren, AnchorHTMLAttributes } from "react"; // Добавил AnchorHTMLAttributes
import cn from 'clsx';
import Link from "next/link"; // Импортируем Link

interface IButtonBaseProps { // Базовые пропсы, общие для кнопки и ссылки
  variant: 'orange' | 'white';
  className?: string; // className должен быть здесь, чтобы cn работал правильно
}

// Пропсы для обычной кнопки
interface IButtonElementProps extends ButtonHTMLAttributes<HTMLButtonElement>, IButtonBaseProps {
  href?: never; // Запрещаем href, если это кнопка
  as?: 'button';
}

// Пропсы для кнопки-ссылки
interface IAnchorElementProps extends AnchorHTMLAttributes<HTMLAnchorElement>, IButtonBaseProps {
  href: string; // href обязателен, если это ссылка
  as: 'a';
}

// Объединяем типы
type IButtonProps = IButtonElementProps | IAnchorElementProps;


const Button: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  className,
  variant,
  ...props // Собираем остальные пропсы
}) => {
  const commonClasses = cn(
    'rounded-xl font-semibold shadow-md px-10 py-2.5 hover:shadow-lg transition duration-300 ease-in-out inline-block text-center', // Добавил inline-block, text-center; изменил padding для лучшего вида
    { // Убедись, что 'bg-primary' это твой оранжевый, а 'text-primary' - оранжевый для белой кнопки
      'text-while bg-primary active:bg-primary/90': variant === 'orange', // Исправлено на text-white
      'text-primary bg-while border border-primary hover:bg-gray-50 active:bg-gray-100': variant === 'white', // Исправлено на bg-white, добавлен border
    },
    className // Переданный className будет применен последним, может переопределять
  );

  // Проверяем, есть ли href, чтобы решить, рендерить Link или button
  if (props.as === 'a' && 'href' in props && props.href) {
    const { href, ...anchorProps } = props as IAnchorElementProps; // Явно типизируем и извлекаем href
    return (
      // <div className='flex justify-center'> // УБИРАЕМ ЭТОТ DIV для гибкого выравнивания
        <Link href={href} passHref legacyBehavior>
          <a {...anchorProps} className={commonClasses}>
            {children}
          </a>
        </Link>
      // </div>
    );
  }
  
  // Если href нет, или as !== 'a', рендерим обычную кнопку
  const { type = 'button', ...buttonProps } = props as IButtonElementProps; // type по умолчанию для кнопки

  return (
    // <div className='flex justify-center'> // УБИРАЕМ ЭТОТ DIV
      <button type={type} {...buttonProps} className={commonClasses}>
        {children}
      </button>
    // </div>
  );
};

export default Button;