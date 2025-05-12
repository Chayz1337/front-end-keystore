// src/components/ui/layout/header/HeaderProfile.tsx
'use client';

import { FC, useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FiLogOut, FiEdit } from "react-icons/fi";

import { useProfile } from "@/src/hooks/useProfile";
import { useOutside } from "@/src/hooks/useOutside";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";
import EditProfileModal from "../../modal/EditProfileModal";
import { IFullUser } from '@/src/types/user.interface';

const HeaderProfile: FC = () => {
  const { profile } = useProfile();
  const { isShow, ref, setIsShow } = useOutside(false);
  const { user } = useAuth();
  const { logout } = useActions();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    console.log("HeaderProfile - profile (from useProfile()):", profile);
    console.log("HeaderProfile - user (from useAuth()):", user);
  }, [profile, user]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsShow(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    setIsShow(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleProfileUpdated = (updatedFullUser: IFullUser) => {
    console.log('Полный профиль обновлен (получено в HeaderProfile):', updatedFullUser);
  };

   let mainDisplayInfo: string | null = null;
   let secondaryDisplayInfo: string | null = null;

   if (profile) {
       mainDisplayInfo = profile.name || profile.email;
       if (profile.name && profile.email && profile.name !== profile.email) {
           secondaryDisplayInfo = profile.email;
       }
   } else if (user?.email) {
       mainDisplayInfo = user.email;
   } else {
       mainDisplayInfo = 'Пользователь';
   }


  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsShow(!isShow)}
          className="focus:outline-none flex items-center space-x-2"
        >
          {profile?.avatar_path ? (
            // === ИЗМЕНЕНИЕ ЗДЕСЬ ===
            // Оборачиваем в div с фиксированным размером w-11 h-11
            <div className="w-11 h-11 flex-shrink-0">
                <Image
                // width/height можно оставить для next/image, но главное - стили ниже
                width={44}
                height={44}
                src={profile.avatar_path}
                alt="profile"
                // Заполняем родительский div, делаем круглым, обрезаем лишнее, добавляем рамку
                className="rounded-full w-full h-full object-cover ring-2 ring-primary"
                />
            </div>
            // === КОНЕЦ ИЗМЕНЕНИЯ ===
          ) : (
            // Placeholder остается как есть
            <div
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-500 text-while ring-2 ring-primary hover:bg-gray-600 transition-colors"
            >
              <FaUserAlt size={24} />
            </div>
          )}
        </button>

        {/* Выпадающее меню без изменений */}
        {isShow && (
           <div
            className="absolute w-auto min-w-[14rem] right-0 z-20 mt-2 py-1 bg-while dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-3">
              {mainDisplayInfo && (
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate" title={mainDisplayInfo}>
                  {mainDisplayInfo}
                </p>
              )}
              {secondaryDisplayInfo && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5" title={secondaryDisplayInfo}>
                  {secondaryDisplayInfo}
                </p>
              )}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <button
              onClick={handleOpenEditModal}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-150"
            >
              <FiEdit className="mr-2 h-4 w-4" /> Редактировать профиль
            </button>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <Link
              href="/my-orders"
              onClick={() => setIsShow(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-150"
            >
              Мои заказы
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-600 dark:hover:bg-red-700 hover:text-while transition-colors duration-150" // Исправил цвет hover для logout
            >
              <FiLogOut className="mr-2 h-4 w-4" /> Выйти
            </button>
          </div>
        )}
      </div>

      {/* Модальное окно без изменений */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        profile={profile}
        onProfileUpdate={handleProfileUpdated}
      />
    </>
  );
};

export default HeaderProfile;