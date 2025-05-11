// src/components/ui/modal/EditProfileModal.tsx
'use client';

import { FC, useEffect, useState, ChangeEvent } from 'react';
import { FiX, FiUploadCloud, FiUser, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';

import { UserProfileUpdateDto, IFullUser } from '@/src/types/user.interface';
import { FileService } from '@/src/assets/styles/services/file.service';
import { UserService } from '@/src/assets/styles/services/user.service';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IFullUser | null | undefined;
  onProfileUpdate?: (updatedUser: IFullUser) => void;
}

const PROFILE_QUERY_KEY = ['get profile'];

const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate
}) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [avatarPathValue, setAvatarPathValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileStatusMessage, setFileStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAvatarPathValue(profile.avatarPath || '');
      setPreviewImage(profile.avatarPath || null);
    } else {
      setName('');
      setAvatarPathValue('');
      setPreviewImage(null);
    }
    setPassword('');
    setShowPassword(false);
    setSelectedFile(null);
    setError(null);
    setFileStatusMessage(null);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileStatusMessage(null);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setFileStatusMessage(`Файл "${file.name}" выбран. Нажмите "Загрузить и использовать".`);
    } else {
      setSelectedFile(null);
      setPreviewImage(avatarPathValue || profile?.avatarPath || null);
    }
  };

  const handleActualFileUpload = async () => {
    if (!selectedFile) {
      setFileStatusMessage("Сначала выберите файл.");
      return;
    }
    setFileStatusMessage(`Загрузка файла "${selectedFile.name}"...`);
    setIsUploadingFile(true);
    setError(null);
    try {
      const filePath = await FileService.uploadUserAvatar(selectedFile);
      setAvatarPathValue(filePath);
      setPreviewImage(filePath);
      setFileStatusMessage(`Файл "${selectedFile.name}" успешно загружен. Теперь можно сохранить профиль.`);
      setSelectedFile(null);
    } catch (uploadError: any) {
      console.error("Ошибка загрузки аватара:", uploadError);
      setFileStatusMessage(`Ошибка: ${uploadError.message || "Не удалось загрузить аватар."}`);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isUploadingFile) {
      setError("Дождитесь завершения загрузки файла аватара.");
      return;
    }
    if (!profile) {
      setError("Ошибка: данные профиля не загружены.");
      return;
    }

    const dataToSubmit: UserProfileUpdateDto = {};
    let hasChanges = false;
    const currentName = profile.name || '';
    const currentAvatarPath = profile.avatarPath || '';

    if (name !== currentName) {
      dataToSubmit.name = name;
      hasChanges = true;
    }
    if (avatarPathValue !== currentAvatarPath) {
      dataToSubmit.avatar_path = avatarPathValue;
      hasChanges = true;
    }
    if (password) {
      if (password.length < 6) {
        setError("Пароль не может быть меньше 6 символов!");
        return;
      }
      dataToSubmit.password = password;
      hasChanges = true;
    }

    if (!hasChanges) {
      setError("Нет изменений для сохранения.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUserDataResponse = await UserService.updateProfile(dataToSubmit);

      if (updatedUserDataResponse?.data) {
        const updated = updatedUserDataResponse.data as Partial<IFullUser>;
        const old = queryClient.getQueryData<IFullUser>(PROFILE_QUERY_KEY);

        if (old) {
          // Мёржим старые вложенные поля (favorites, orders)
          const merged: IFullUser = {
            ...old,
            ...updated,
            favorites: old.favorites,
            orders: old.orders,
          };
          queryClient.setQueryData(PROFILE_QUERY_KEY, merged);
          onProfileUpdate?.(merged);
        } else {
          // Если кэша не было — перезапрашиваем полный профиль
          await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        }

        onClose();
      } else {
        console.error("Ответ от UserService.updateProfile не содержит data.");
        setError("Не удалось получить обновленные данные профиля от сервера.");
      }
    } catch (err: any) {
      console.error("Ошибка при обновлении профиля:", err);
      let errorMessage = "Произошла ошибка при обновлении профиля.";
      if (err.response?.data?.message) {
        errorMessage = Array.isArray(err.response.data.message)
          ? err.response.data.message.join('; ')
          : err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const noChangesMade =
    !password &&
    name === (profile?.name || '') &&
    avatarPathValue === (profile?.avatarPath || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-while p-6 rounded-lg shadow-xl w-full max-w-lg relative dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
          disabled={isLoading || isUploadingFile}
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Редактирование профиля
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Имя */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:disabled:bg-gray-600"
              placeholder="Ваше имя"
              disabled={isLoading || isUploadingFile}
            />
          </div>

          {/* Аватар */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Аватар
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Превью аватара"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                    onError={() => setPreviewImage(null)}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <FiUser size={36} />
                  </div>
                )}
              </div>
              <div className="flex-grow w-full">
                <label
                  htmlFor="avatarFile"
                  className={`w-full flex items-center justify-center cursor-pointer px-3 py-2 bg-while dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    isLoading || isUploadingFile ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiUploadCloud className="inline-block mr-2" />
                  <span>{selectedFile ? selectedFile.name : 'Выбрать файл...'}</span>
                  <input
                    type="file"
                    id="avatarFile"
                    name="avatarFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={isLoading || isUploadingFile}
                  />
                </label>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleActualFileUpload}
                    className={`mt-2 w-full flex items-center justify-center px-3 py-2 bg-green-500 text-while rounded-md shadow-sm text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      isUploadingFile || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isUploadingFile || isLoading}
                  >
                    {isUploadingFile ? (
                      <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-while" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Загрузка...</>
                    ) : (
                      <><FiUploadCloud className="mr-2" />Загрузить и использовать</>
                    )}
                  </button>
                )}
              </div>
            </div>
            {fileStatusMessage && (
              <p className={`mt-2 text-xs ${fileStatusMessage.includes("Ошибка") ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {fileStatusMessage}
              </p>
            )}
            <div className="mt-3">
              <label htmlFor="avatarPathInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Или укажите прямой URL/путь к аватару:
              </label>
              <input
                type="text"
                id="avatarPathInput"
                name="avatar_path"
                value={avatarPathValue}
                onChange={(e) => {
                  setAvatarPathValue(e.target.value);
                  setPreviewImage(e.target.value);
                  setSelectedFile(null);
                  setFileStatusMessage(null);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:disabled:bg-gray-600"
                placeholder="/uploads/avatars/your_avatar.png или http://..."
                disabled={isLoading || isUploadingFile}
              />
            </div>
          </div>

          {/* Пароль */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Новый пароль
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:disabled:bg-gray-600 pr-10"
                placeholder="Не менее 6 символов. Оставьте пустым, если не хотите менять"
                autoComplete="new-password"
                disabled={isLoading || isUploadingFile}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                disabled={isLoading || isUploadingFile}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
              disabled={isLoading || isUploadingFile}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="min-w-[150px] flex items-center justify-center px-4 py-2 text-sm font-medium text-while bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:bg-primary-light"
              disabled={isLoading || isUploadingFile || noChangesMade}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-while" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Сохранение...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-5 w-5" />Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
