// src/components/ui/layout/header/HeaderProfile.tsx
'use client';

import { FC, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { FiLogOut, FiEdit } from "react-icons/fi";

import { useProfile } from "@/src/hooks/useProfile";
import { useOutside } from "@/src/hooks/useOutside";
import { useAuth } from "@/src/hooks/useAuth";
import { useActions } from "@/src/hooks/user.actions";
import EditProfileModal from "../../modal/EditProfileModal";
// Убедись, что импорт IUser существует, если будешь явно типизировать profile в onProfileUpdate
// import { IUser } from '@/src/types/user.interface';

const HeaderProfile: FC = () => {
  // Предполагаем, что useProfile может возвращать setProfile или его обновление происходит иначе
  const { profile /*, setProfile */ } = useProfile(); // Если есть setProfile, раскомментируй
  const { isShow, ref, setIsShow } = useOutside(false);
  const { user } = useAuth();
  const { logout } = useActions();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

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

  // Функция для обновления профиля после редактирования в модальном окне
  // Типизация `updatedUserData` должна соответствовать тому, что возвращает ваш API (обычно IUser)
  const handleProfileUpdated = (updatedUserData: any /* IUser */) => {
    // Здесь логика обновления 'profile'
    // Вариант 1: Если useProfile возвращает setProfile
    // if (setProfile) {
    //   setProfile(updatedUserData);
    // }

    // Вариант 2: Если useProfile основан на react-query/SWR,
    // то после успешного обновления в EditProfileModal
    // можно было бы вызвать queryClient.invalidateQueries(['profile']) или mutate() из SWR.
    // В этом случае onProfileUpdate может быть и не нужен, если EditProfileModal
    // сам отвечает за инвалидацию кеша.

    // Вариант 3: Если profile - это часть глобального стейта (Redux, Zustand)
    // dispatch(updateUserAction(updatedUserData));

    // Пока что для примера:
    console.log('Профиль обновлен, нужно обновить состояние:', updatedUserData);
    // Для немедленного отображения изменений (если setProfile нет), потребуется перезагрузка или инвалидация
    // одного из хуков useProfile/useAuth, чтобы они отдали свежие данные.
    // Простейший, но не лучший способ - перезагрузить страницу (не рекомендуется для SPA)
    // window.location.reload();
  };


  // Отображаемое имя пользователя
  // Используем profile.name (согласно IUser), если в вашем случае это profile.username, замените
  const displayName = profile?.name || user?.email || 'Пользователь'; // Фоллбэк на email или "Пользователь"

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsShow(!isShow)}
          className="focus:outline-none flex items-center space-x-2" // Добавил flex для текста рядом с авой (если захочешь)
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
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-500 text-while ring-2 ring-primary hover:bg-black"
            // Убрал text-while, предполагая, что text-gray-500 лучше
            >
              <FaUserAlt size={24} />
            </div>
          )}
          {/* Опционально: можно отображать имя пользователя рядом с аватаркой */}
          {/* <span className="text-sm hidden md:block">{displayName}</span> */}
        </button>

        {isShow && (
          <div
            className="absolute w-auto min-w-[12rem] right-0 z-20 mt-2 py-1 bg-while rounded-md shadow-xl border border-gray-200"
            // Убрал bg-while, заменил на bg-while
            // Увеличил ширину для вмещения имени пользователя (min-w-[12rem] или w-auto)
          >
            {/* Отображение имени пользователя и email */}
            <div className="px-4 py-3">
              <p className="text-xl font-medium text-gray-900 truncate">
             Имя: {displayName}
              </p>
              {user?.email && (
                <p className="text-xl text-gray-500 truncate mt-0.5">
                 Почта: {user.email}
                </p>
              )}
            </div>
            <div className="border-t border-gray-200 my-1"></div>

            <button
              onClick={handleOpenEditModal}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
            >
              <FiEdit className="mr-2 h-4 w-4" />
              Редактировать профиль
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
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red transition-colors duration-150"
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Выйти
            </button>
          </div>
        )}
      </div>

      {/* Используем компонент модального окна */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        profile={profile}
        onProfileUpdate={handleProfileUpdated} // <--- Передаем колбэк
      />
    </>
  );
};

export default HeaderProfile;