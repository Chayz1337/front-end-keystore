// src/components/ui/modal/EditProfileModal.tsx
'use client';

import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { FiX, FiUploadCloud, FiUser, FiSave, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiInfo, FiTrash2 } from 'react-icons/fi';
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
const AVATAR_BUCKET_PATH_SEGMENT = '/avatar/';

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
  const [fileStatus, setFileStatus] = useState<{ message: string | null; type: 'info' | 'success' | 'error' }>({ message: null, type: 'info' });
  const [isAvatarMarkedForDeletion, setIsAvatarMarkedForDeletion] = useState(false);

  const initialAvatarRef = useRef<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.name || '');
      const currentAvatar = profile.avatar_path || '';
      setAvatarPathValue(currentAvatar);
      setPreviewImage(currentAvatar);
      initialAvatarRef.current = currentAvatar;
      setIsAvatarMarkedForDeletion(false);
    } else if (!isOpen) {
      setName('');
      setAvatarPathValue('');
      setPassword('');
      setShowPassword(false);
      setSelectedFile(null);
      setPreviewImage(null);
      setIsLoading(false);
      setIsUploadingFile(false);
      setError(null);
      setFileStatus({ message: null, type: 'info' });
      initialAvatarRef.current = null;
      setIsAvatarMarkedForDeletion(false);
    }
  }, [profile, isOpen]);

  useEffect(() => {
      if (!isOpen) {
          document.body.style.overflow = '';
          return;
        }
        const handleOutsideClick = (event: MouseEvent) => {
          if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
            let targetElement = event.target as HTMLElement;
            let clickedSelectPortal = false;
            while (targetElement) {
              if (targetElement.classList && targetElement.classList.contains('react-select__menu')) {
                clickedSelectPortal = true;
                break;
              }
              targetElement = targetElement.parentElement as HTMLElement;
            }
            if (!clickedSelectPortal) {
              onClose();
            }
          }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
        };
    }, [isOpen, onClose])

  if (!isOpen) return null;

  const isValidImageSrc = Boolean(
    previewImage &&
    (previewImage.startsWith('/') || previewImage.startsWith('http') || previewImage.startsWith('data:image'))
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileStatus({ message: null, type: 'info' });
    setSelectedFile(file);
    setIsAvatarMarkedForDeletion(false);

    if (file) {
      const maxFileSize = 5 * 1024 * 1024;
      if (file.size > maxFileSize) {
        setFileStatus({ message: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)}MB). Максимум 5MB.`, type: 'error' });
        setSelectedFile(null);
        setPreviewImage(avatarPathValue || null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setFileStatus({ message: `Выбран: "${file.name}". Нажмите "Загрузить".`, type: 'info' });
    } else {
      setPreviewImage(avatarPathValue || null);
    }
    if (e.target) e.target.value = '';
  };

  const handleActualFileUpload = async () => {
    if (!selectedFile) {
      setFileStatus({ message: "Пожалуйста, сначала выберите файл.", type: 'error' });
      return;
    }
    setIsUploadingFile(true);
    setError(null);
    setFileStatus({ message: `Загрузка файла "${selectedFile.name}"...`, type: 'info' });
    try {
      const url = await FileService.uploadUserAvatar(selectedFile);
      setAvatarPathValue(url);
      setPreviewImage(url);
      setFileStatus({ message: `Файл "${selectedFile.name}" успешно загружен.`, type: 'success' });
      setSelectedFile(null);
      setIsAvatarMarkedForDeletion(false);
    } catch (uploadError: any) {
      console.error("Ошибка загрузки аватара:", uploadError);
      const errorMsg = uploadError?.response?.data?.message || uploadError.message || "Неизвестная ошибка загрузки.";
      setFileStatus({ message: `Ошибка: ${Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg}`, type: 'error' });
      setPreviewImage(initialAvatarRef.current || null);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleDeleteCurrentAvatar = () => {
    setError(null);
    setFileStatus({ message: "Аватар будет удален после сохранения.", type: 'info' });
    setAvatarPathValue('');
    setPreviewImage(null);
    setSelectedFile(null);
    setIsAvatarMarkedForDeletion(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isUploadingFile) {
      setError("Пожалуйста, дождитесь завершения загрузки файла.");
      return;
    }
    if (!profile) {
      setError("Данные профиля не загружены.");
      return;
    }

    const dto: UserProfileUpdateDto = {};
    let hasChanges = false;

    const trimmedName = name.trim();
    if (trimmedName !== (profile.name || '').trim()) {
      if (!trimmedName) {
        setError("Имя не может быть пустым.");
        return;
      }
      dto.name = trimmedName;
      hasChanges = true;
    }

    if (avatarPathValue !== (profile.avatar_path || '') || isAvatarMarkedForDeletion) {
      dto.avatar_path = avatarPathValue;
      hasChanges = true;
    }

    if (password) {
      if (password.length < 6) {
        setError("Новый пароль должен содержать не менее 6 символов.");
        return;
      }
      dto.password = password;
      hasChanges = true;
    }

    if (!hasChanges) {
      setError("Нет изменений для сохранения.");
      return;
    }

    setIsLoading(true);
    try {
      const oldAvatarUrl = initialAvatarRef.current;
      const newAvatarUrl = avatarPathValue;

       if (oldAvatarUrl && oldAvatarUrl !== newAvatarUrl && oldAvatarUrl.startsWith('http')) {
        try {
            const parsedOldUrl = new URL(oldAvatarUrl);
            if (parsedOldUrl.pathname.startsWith(AVATAR_BUCKET_PATH_SEGMENT)) {
                console.log(`Попытка удаления старого аватара с MinIO: ${oldAvatarUrl}`);
                await FileService.deleteUserAvatarByUrl(oldAvatarUrl);
                console.log("Старый аватар успешно удалён с MinIO:", oldAvatarUrl);
            }
        } catch (urlParseError) {
            console.warn("Не удалось распарсить URL старого аватара, пропуск удаления из MinIO:", oldAvatarUrl, urlParseError);
        } 
      }

      const resp = await UserService.updateProfile(dto);
      const updatedUserData = resp.data as Partial<IFullUser>;

      queryClient.setQueryData(PROFILE_QUERY_KEY, (oldData: IFullUser | undefined) => {
        if (oldData) {
          return {
             ...oldData,
             ...updatedUserData,
             avatar_path: newAvatarUrl
            };
        }
        const baseData = updatedUserData.id ? updatedUserData : {};
        return { ...baseData, avatar_path: newAvatarUrl } as IFullUser;
      });

      const finalUserData = queryClient.getQueryData<IFullUser>(PROFILE_QUERY_KEY);
      if (finalUserData) {
        onProfileUpdate?.(finalUserData);
      }

      onClose();

    } catch (err: any) {
      console.error("Ошибка обновления профиля:", err);
      const errorMsg = err.response?.data?.message || err.message || "Произошла ошибка при обновлении.";
      setError(Array.isArray(errorMsg) ? errorMsg.join('; ') : errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(x => !x);

  const isNameChanged = name.trim() !== (profile?.name || '').trim();
  const isAvatarChanged = avatarPathValue !== (profile?.avatar_path || '') || (isAvatarMarkedForDeletion && profile?.avatar_path);
  const isPasswordSet = Boolean(password);
  const hasNoChangesToSave = !isNameChanged && !isAvatarChanged && !isPasswordSet;

  const showDeleteAvatarButton = avatarPathValue && !selectedFile && !isAvatarMarkedForDeletion;


  // --- Рендеринг JSX ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div
        ref={modalContentRef}
        className="bg-while dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-scale-in"
        style={{ animationFillMode: 'forwards' }}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          disabled={isLoading || isUploadingFile}
          className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Закрыть"
        >
          <FiX size={22} />
        </button>

        {/* Заголовок */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Редактировать профиль
        </h2>

        {/* Блок ошибки */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md flex items-center gap-2 text-sm">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Поле "Имя" */}
          <div>
            <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя
            </label>
            <input
              id="profileName"
              name="profileName"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isLoading || isUploadingFile}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ваше имя"
              autoComplete="off"
            />
          </div>

          {/* Блок "Аватар" */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 -mb-2">
              Аватар
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Превью */}
              <div className="flex-shrink-0 w-20 h-20"> {/* Задаем явный размер контейнеру */}
                {isValidImageSrc ? (
                  <Image
                    src={previewImage!}
                    alt="Превью аватара"
                    width={80}
                    height={80}
                    // === ИЗМЕНЕНИЕ ЗДЕСЬ: Возвращаем обводку ===
                    className="rounded-full w-full h-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    onError={() => {
                        if (previewImage !== initialAvatarRef.current) {
                            setPreviewImage(initialAvatarRef.current || null)
                        } else {
                            setPreviewImage(null);
                        }
                    }}
                  />
                ) : (
                  // Placeholder также с обводкой
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <FiUser size={36} className="text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              {/* Опции загрузки/удаления файла */}
              <div className="flex-grow w-full space-y-3 overflow-hidden">
                 {/* Кнопка "Выбрать новый файл..." */}
                 <label
                  className={`flex w-full items-center justify-center gap-2 px-3 py-2 border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isLoading || isUploadingFile ? 'opacity-50 cursor-not-allowed' : ''} overflow-hidden`}
                 >
                  <FiUploadCloud size={16} className="flex-shrink-0" />
                  <span className="text-sm truncate whilespace-nowrap"> {/* Исправлена опечатка whilespace -> whilespace */}
                    {selectedFile?.name ? `Файл: ${selectedFile.name}` : 'Выбрать новый файл...'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isLoading || isUploadingFile}
                    autoComplete="off"
                  />
                 </label>

                {/* Кнопка "Загрузить и использовать" */}
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleActualFileUpload}
                    disabled={isLoading || isUploadingFile}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-while rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" // text-while заменен на text-while
                  >
                    {isUploadingFile
                     ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-while" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.649-2.649z"></path></svg> Загрузка...</> // text-while заменен на text-while
                     : <> <FiUploadCloud size={16} /> Загрузить и использовать</>
                    }
                  </button>
                )}

                {/* Кнопка "Удалить аватар" */}
                {showDeleteAvatarButton && (
                   <button
                    type="button"
                    onClick={handleDeleteCurrentAvatar}
                    disabled={isLoading || isUploadingFile}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-while rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" // text-while заменен на text-while
                  >
                    <FiTrash2 size={16} /> Удалить аватар
                  </button>
                )}

                {/* Статус файла */}
                {fileStatus.message && (
                  <p className={`mt-1 text-xs flex items-center gap-1 ${
                      fileStatus.type === 'error' ? 'text-red-600 dark:text-red-400' :
                      fileStatus.type === 'success' ? 'text-green-600 dark:text-green-400' :
                      'text-gray-600 dark:text-gray-400'
                  }`}>
                    {fileStatus.type === 'error' && <FiAlertCircle size={12} />}
                    {fileStatus.type === 'success' && <FiCheckCircle size={12} />}
                    {fileStatus.type === 'info' && <FiInfo size={12} />}
                    <span>{fileStatus.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Поле "Пароль" */}
          <div>
            <label htmlFor="profilePassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Новый пароль (если нужно изменить)
            </label>
            <div className="relative">
              <input
                id="profilePassword"
                name="profilePassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error && password.length >= 5) setError(null);
                }}
                disabled={isLoading || isUploadingFile}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Оставьте пустым, чтобы не менять"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                disabled={isLoading || isUploadingFile}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none rounded-r-md disabled:opacity-50"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {password && password.length > 0 && password.length < 6 && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <FiInfo size={12} /> Пароль должен быть не менее 6 символов.
              </p>
            )}
          </div>

          {/* Кнопки формы "Отмена" и "Сохранить" */}
          <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading || isUploadingFile}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploadingFile || hasNoChangesToSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-while rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-1.5" // text-while заменен на text-while
              >
                {isLoading
                 ? <><svg className="animate-spin h-4 w-4 text-while" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2.649-2.649z"></path></svg> Сохранение...</> // text-while заменен на text-while
                 : <><FiSave size={16} /> Сохранить</>
                }
              </button>
          </div>
        </form>
      </div>

       {/* Глобальные стили */}
       <style jsx global>{`
        @keyframes modal-scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-scale-in { animation: modal-scale-in 0.2s ease-out; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px while inset !important; /* Светлая тема */
            box-shadow: 0 0 0 30px while inset !important; /* Светлая тема */
             -webkit-text-fill-color: #1f2937 !important;
        }
        /* Темная тема для автозаполнения */
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
             -webkit-box-shadow: 0 0 0 30px #374151 inset !important; /* Цвет фона темной темы */
             box-shadow: 0 0 0 30px #374151 inset !important; /* Цвет фона темной темы */
             -webkit-text-fill-color: #f3f4f6 !important; /* Цвет текста темной темы */
        }
        /* Исправление для опечатки в стилях кнопок */
        .text-while { color: while; }
      `}</style>
    </div>
  );
};

export default EditProfileModal;