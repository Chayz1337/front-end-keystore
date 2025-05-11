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
import { IFullUser } from '@/src/types/user.interface'; // Убедись, что IFullUser импортирован

const HeaderProfile: FC = () => {
  const { profile } = useProfile(); // profile здесь IFullUser
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

  const handleProfileUpdated = (updatedFullUser: IFullUser) => { // <--- Тип изменен на IFullUser
    console.log('Полный профиль обновлен (получено в HeaderProfile через onProfileUpdate):', updatedFullUser);
    // UI уже должен быть обновлен благодаря queryClient.setQueryData в EditProfileModal.
    // Этот коллбэк здесь для информации или дополнительных побочных эффектов, если они нужны.
  };

  // Логика отображения mainDisplayInfo и secondaryDisplayInfo остается такой же
  let mainDisplayInfo: string | null = null;
  let secondaryDisplayInfo: string | null = null;

  if (profile && profile.name) {
    mainDisplayInfo = profile.name;
    if (user?.email && user.email !== profile.name) {
      secondaryDisplayInfo = user.email;
    }
  } else if (user?.email) {
    mainDisplayInfo = user.email;
  } else {
    mainDisplayInfo = 'Пользователь';
  }

  // JSX остается без изменений, как в предыдущем моем ответе
  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsShow(!isShow)}
          className="focus:outline-none flex items-center space-x-2"
        >
          {profile?.avatarPath ? (
            <Image
              width={45}
              height={45}
              src={profile.avatarPath}
              alt="profile"
              className="rounded-full ring-2 ring-primary"
            />
          ) : (
            <div
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-500 text-while ring-2 ring-primary hover:bg-gray-600 transition-colors"
            >
              <FaUserAlt size={24} />
            </div>
          )}
        </button>

        {isShow && (
          <div
            className="absolute w-auto min-w-[14rem] right-0 z-20 mt-2 py-1 bg-while rounded-md shadow-xl border border-gray-200"
          >
            <div className="px-4 py-3">
              {mainDisplayInfo && (
                <p className="text-lg font-semibold text-gray-900 truncate" title={mainDisplayInfo}>
                  {mainDisplayInfo}
                </p>
              )}
              {secondaryDisplayInfo && (
                <p className="text-sm text-gray-500 truncate mt-0.5" title={secondaryDisplayInfo}>
                  {secondaryDisplayInfo}
                </p>
              )}
            </div>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={handleOpenEditModal}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
            >
              <FiEdit className="mr-2 h-4 w-4" /> Редактировать профиль
            </button>
            <div className="border-t border-gray-200 my-1"></div>
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
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-150"
            >
              <FiLogOut className="mr-2 h-4 w-4" /> Выйти
            </button>
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        profile={profile} // profile это IFullUser
        onProfileUpdate={handleProfileUpdated} // передаем коллбэк, ожидающий IFullUser
      />
    </>
  );
};

export default HeaderProfile;