import Link from "next/link";
import { FC, DetailedHTMLProps, HTMLAttributes } from "react"; // <-- Импортируем нужные типы
import Image from "next/image";
import { AiOutlineHeart } from "react-icons/ai";
import HeaderProfile from "./HeaderProfile";
import Search from "./Search";
import HeaderCart from "./cart/HeaderCart";
import { useIsAdminPanel } from "@/src/hooks/useIsAdminPanel";
import { useAuth } from "@/src/hooks/useAuth";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { cn } from "@/src/utils/cn"; // <-- Импортируем cn, если он у вас есть и используется

// Определяем интерфейс пропсов.
// Расширяем его, включая все стандартные HTML атрибуты для тега <header>
interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement> {
    // Здесь можно добавить любые специфичные пропсы для Header, если они есть
    // например: someCustomProp?: string;
}

// Применяем интерфейс HeaderProps к типу FC
const Header: FC<HeaderProps> = ({
    className, // Теперь TypeScript знает, что мы принимаем className
    style,     // Теперь TypeScript знает, что мы принимаем style
    children,  // Стандартный пропс для дочерних элементов
    ...rest    // Остальные стандартные атрибуты (id, onClick и т.д.)
}) => {
    const { isAdminPanel } = useIsAdminPanel();
    const { user } = useAuth();

    // Ваши существующие классы на теге header
    const internalClasses = "bg-secondary w-full py-6 px-6 grid";

    // Ваши существующие стили (для gridTemplateColumns)
    const internalStyles = { gridTemplateColumns: '1fr 3fr 1.2fr' }; // Стили GridColumns лучше оставить тут, т.к. они относятся к внутренней раскладке хедера

    return (
        <header
            // Используем cn для объединения ваших внутренних классов с классами, переданными снаружи
            // className из пропсов (например, h-[91px]) будет ДОБАВЛЕНО к internalClasses
            className={cn(internalClasses, className)}
            // Объединяем внутренние стили с переданными извне (например, стиль высоты из Layout, если решили передавать так)
            // Стиль из `style` пропса может переопределить свойства из internalStyles, если они совпадают.
            style={{ ...internalStyles, ...style }}
            {...rest} // Прокидываем все остальные стандартные атрибуты
        >
            <Link href="/">
                {isAdminPanel ? (
                    <h2 className='text-3xl text-white font-semibold'>Admin Panel</h2>) : ( // Заменил 'text-while' на 'text-white'
                    <Image priority width={300} height={110} src="/images/logo.png" alt="GameShop" />)}
            </Link>
            <Search />
            <div className="flex items-center justify-end gap-10">
                {user?.role === 'ADMIN' && (
                    <Link href="/admin"
                        className="hover:text-primary transition-colors duration-200 text-white inline-block text-lg"> {/* Заменил 'text-while' на 'text-white' */}
                        <MdOutlineAdminPanelSettings size={37} />
                    </Link>
                )}

                {user && (
                    <Link href='/favorites' className="text-white"> {/* Заменил 'text-while' на 'text-white' */}
                        <AiOutlineHeart size={37} />
                    </Link>
                )}
                <HeaderCart />
                <HeaderProfile />
            </div>
             {children} {/* Добавляем children на случай, если хедер когда-нибудь будет их принимать из родителя */}
        </header>
    );
};

export default Header;