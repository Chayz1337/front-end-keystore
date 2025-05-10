// src/components/ui/layout/header/HeaderProfile.tsx
'use client';

import { FC } from "react";
import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";

import { useProfile } from "@/src/hooks/useProfile";
import { useOutside } from "@/src/hooks/useOutside";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";

const HeaderProfile: FC = () => {
  const { profile } = useProfile();
  const { isShow, ref, setIsShow } = useOutside(false);
  const { user } = useAuth();
  const { logout } = useActions();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsShow(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsShow(!isShow)} className="focus:outline-none">
        {profile?.avatarPath ? (
          <Image
            width={45}
            height={45}
            src={profile.avatarPath}
            alt="profile"
            className="rounded-full ring-2 ring-primary" // Рамка стала толще: ring-2
          />
        ) : (
          // Иконка по умолчанию
          <div
            className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-200 text-while ring-2 ring-primary hover:bg-black"
            // Изменения:
            // 1. text-while -> text-gray-500 (для цвета иконки FaUserAlt)
            // 2. ring-1 -> ring-2 (рамка стала толще)
            // 3. hover-эффект для текста иконки (если нужен, например hover:text-white или hover:text-primary) сейчас не указан, только фон меняется на hover:bg-black
          >
            <FaUserAlt size={24} />
          </div>
        )}
      </button>

      {isShow && (
        <div
          className="absolute w-48 right-0 z-20 mt-2 py-1 bg-while rounded-md shadow-xl border border-gray-200" // bg-while -> bg-white (стандартный белый фон для меню)
        >
          <Link
            href="/my-orders"
            onClick={() => setIsShow(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
          >
            Мои заказы
          </Link>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red transition-colors duration-150" // hover:text-red -> hover:text-red-600 для более явного красного
          >
            <FiLogOut className="mr-2 h-4 w-4" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderProfile;