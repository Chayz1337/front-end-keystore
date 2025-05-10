// src/components/ui/modal/EditProfileModal.tsx
'use client';

import { FC, useEffect, useState, ChangeEvent } from 'react';
// Добавляем FiEye и FiEyeOff для иконки пароля
import { FiX, FiUploadCloud, FiUser, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';

import { IUser, UserProfileUpdateDto } from '@/src/types/user.interface';
import { FileService } from '@/src/assets/styles/services/file.service';
import { UserService } from '@/src/assets/styles/services/user.service';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IUser | null | undefined;
  onProfileUpdate?: (updatedUser: IUser) => void;
}

const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onProfileUpdate }) => {
  const [username, setUsername] = useState('');
  const [avatarPathValue, setAvatarPathValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <--- Новое состояние для видимости пароля

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileStatusMessage, setFileStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername( profile.name || '');
      setAvatarPathValue(profile.avatarPath || '');
      setPreviewImage(profile.avatarPath || null);
    } else {
      setUsername('');
      setAvatarPathValue('');
      setPreviewImage(null);
    }
    setPassword('');
    setShowPassword(false); // Сбрасываем видимость пароля при открытии
    setSelectedFile(null);
    setError(null);
    setFileStatusMessage(null);
  }, [profile, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // ... (без изменений)
    const file = event.target.files?.[0];
    setFileStatusMessage(null);
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileStatusMessage(`Файл "${file.name}" выбран. Нажмите "Загрузить и использовать" для загрузки на сервер.`);
    } else {
      setSelectedFile(null);
      setPreviewImage(avatarPathValue || profile?.avatarPath || null);
    }
  };

  const handleActualFileUpload = async () => {
    // ... (без изменений)
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
      setFileStatusMessage(`Файл "${selectedFile.name}" успешно загружен. Путь: ${filePath}. Теперь можно сохранить профиль.`);
      setSelectedFile(null);
    } catch (uploadError: any) {
      console.error("Ошибка загрузки аватара:", uploadError);
      setFileStatusMessage(`Ошибка: ${uploadError.message || "Не удалось загрузить аватар."}`);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // ... (без изменений, но убедись, что `console.log` для отладки 'Нет изменений' есть или убран)
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
    const currentUsername = profile.name || '';
    const currentAvatarPath = profile.avatarPath || '';

    // Отладочные логи, которые помогут понять "Нет изменений"
    console.log('Проверка изменений для отправки:');
    console.log(`Username: '${username}' vs '${currentUsername}' -> ${username !== currentUsername}`);
    console.log(`Avatar Path: '${avatarPathValue}' vs '${currentAvatarPath}' -> ${avatarPathValue !== currentAvatarPath}`);
    console.log(`Password: ${password ? 'введен' : 'не введен'}`);


    if (username !== currentUsername) {
      dataToSubmit.username = username;
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
      console.log('Сообщение "Нет изменений для сохранения" установлено, т.к. hasChanges = false'); // Лог для отладки
      return;
    }

    console.log("Данные для отправки (dataToSubmit):", JSON.stringify(dataToSubmit, null, 2));
    setIsLoading(true);
    try {
      const updatedUserData = await UserService.updateProfile(dataToSubmit);
      if (onProfileUpdate && updatedUserData?.data) {
        onProfileUpdate(updatedUserData.data);
      }
      onClose();
    } catch (err: any) {
      console.error("Ошибка при обновлении профиля:", err);
      let errorMessage = "Произошла ошибка при обновлении профиля.";
      if (err.response) {
         const apiError = err.response.data;
         if (apiError && apiError.message) {
             if (Array.isArray(apiError.message)) { errorMessage = apiError.message.join('; '); }
             else { errorMessage = apiError.message; }
         } else if (err.response.statusText) { errorMessage = `Ошибка: ${err.response.status} - ${err.response.statusText}`; }
      } else if (err.message) { errorMessage = err.message; }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Полный JSX из твоего предыдущего ответа с добавлением иконки для пароля.
  // И я заменю 'bg-while' на 'bg-while', 'text-while' на 'text-while' (если это для текста на цветном фоне)
  // или 'text-gray-XXX' для текста на белом фоне.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-while p-6 rounded-lg shadow-xl w-full max-w-lg relative"> {/* Используем bg-while */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-50"
          aria-label="Закрыть модальное окно"
          disabled={isLoading || isUploadingFile}
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Редактирование профиля
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Поле Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Имя пользователя (Username)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
              placeholder="Ваше имя пользователя"
              disabled={isLoading || isUploadingFile}
            />
          </div>

          {/* Блок для Аватара */}
          <div className="p-4 border border-gray-200 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Аватар</label>
            
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
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <FiUser size={36} />
                  </div>
                )}
              </div>

              <div className="flex-grow w-full">
                <label
                  htmlFor="avatarFile"
                  className="w-full flex items-center justify-center cursor-pointer px-3 py-2 bg-while border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
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
                    className="mt-2 w-full flex items-center justify-center px-3 py-2 bg-green-500 text-while rounded-md shadow-sm text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={isUploadingFile || isLoading}
                  >
                    {isUploadingFile ? (
                        <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-while" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Загрузка...</>
                    ) : (
                        <> <FiUploadCloud className="mr-2" /> Загрузить и использовать </>
                    )}
                  </button>
                )}
              </div>
            </div>
            {fileStatusMessage && (
                <p className={`mt-2 text-xs ${fileStatusMessage.includes("Ошибка") || fileStatusMessage.includes("Не удалось") ? 'text-red-600' : 'text-gray-600'}`}>{fileStatusMessage}</p>
            )}

            <div className="mt-3">
              <label htmlFor="avatarPathInput" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
                placeholder="/uploads/avatars/your_avatar.png или http://..."
                disabled={isLoading || isUploadingFile}
              />
            </div>
          </div>

          {/* Поле Пароль с иконкой показать/скрыть */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <div className="relative mt-1"> {/* Обертка для позиционирования иконки */}
              <input
                type={showPassword ? 'text' : 'password'} // <--- Динамический тип
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 pr-10" // pr-10 для места под иконку
                placeholder="Не менее 6 символов. Оставьте пустым, если не хотите менять"
                autoComplete="new-password"
                disabled={isLoading || isUploadingFile}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                disabled={isLoading || isUploadingFile}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Кнопки Сохранить/Отмена */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
              disabled={isLoading || isUploadingFile}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-while bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:bg-primary-light"
              // text-while -> text-while
              disabled={isLoading || isUploadingFile}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditProfileModal;