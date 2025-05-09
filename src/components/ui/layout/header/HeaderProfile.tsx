// src/components/ui/layout/header/HeaderProfile.tsx
'use client'; // Если используется в App Router и содержит клиентские хуки

import { FC } from "react";
import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi"; // Иконка для выхода

import { useProfile } from "@/src/hooks/useProfile";
import { useOutside } from "@/src/hooks/useOutside";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions"; // <<<=== Импортируем useActions

const HeaderProfile: FC = () => {
  const { profile } = useProfile();
  const { isShow, ref, setIsShow } = useOutside(false);
  const { user } = useAuth();
  const { logout } = useActions(); // <<<=== Получаем функцию logout

  // Если пользователя нет в системе, не показываем этот компонент
  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsShow(false); // Закрываем меню после выхода
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsShow(!isShow)} className="focus:outline-none"> {/* Добавил focus:outline-none для лучшего UX */}
        {profile?.avatarPath ? (
          <Image
            width={45}
            height={45}
            src={profile.avatarPath}
            alt="profile"
            // className="rounded-full border-primary border border-solid animate-soft-ping"
            // Анимация animate-soft-ping может быть слишком навязчивой, можно убрать или заменить
            className="rounded-full border-primary border border-solid"
          />
        ) : (
          // Иконка по умолчанию, если нет аватара
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 border border-gray-300 text-while "> {/* Немного изменил стили для дефолтной иконки */}
            <FaUserAlt size={22} /> {/* Уменьшил размер иконки для лучшего вида */}
          </div>
        )}
      </button>

      {isShow && (
        <div
          className="absolute w-48 right-0 z-20 mt-2 py-1 bg-while rounded-md shadow-xl border border-gray-200" // Обновил стили для выпадающего меню
          // style={{ top: "calc(100% + 0.5rem)" }} // Можно использовать mt-2 вместо этого
        >
          <Link
            href="/my-orders"
            onClick={() => setIsShow(false)} // Закрываем меню при клике на ссылку
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
          >
            Мои заказы
          </Link>
          {/* Можно добавить другие ссылки сюда, например, "Профиль" */}
          {/* <Link
            href="/profile"
            onClick={() => setIsShow(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
          >
            Профиль
          </Link> */}
          <div className="border-t border-gray-200 my-1"></div> {/* Разделитель */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red transition-colors duration-150" // Изменил hover цвет на красный
          >
            <FiLogOut className="mr-2 h-4 w-4 h" /> {/* Иконка выхода */}
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderProfile;