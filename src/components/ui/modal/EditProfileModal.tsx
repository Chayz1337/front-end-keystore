'use client';

import { FC, useEffect, useState, ChangeEvent, useRef } from 'react';
import { FiX, FiUploadCloud, FiUser, FiSave, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiInfo, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { FaUserAlt } from 'react-icons/fa';

import { IFullUser } from '@/src/types/user.interface'; 
import { UserService } from '@/src/assets/styles/services/user.service'; 
// FileService теперь не импортируем, если вся логика файла аватара инкапсулирована
// в UserService.updateProfile (который принимает FormData)

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: IFullUser | null | undefined;
  onProfileUpdate?: (updatedUser: IFullUser) => void;
}

const PROFILE_QUERY_KEY = ['get profile'];

// URL для отображения в UI (публичный) и URL-префикс, который может возвращать бэкенд
const PUBLIC_DISPLAY_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT_LOCAL || '';
const S3_BACKEND_URL_PREFIX_TO_REPLACE = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || '';

function extractErrorMessage(error: any, context: string): string {
  if (error?.response?.data?.message) {
    const message = error.response.data.message;
    return Array.isArray(message) ? message.join('; ') : String(message);
  }
  if (error?.message) {
    return error.message;
  }
  return `Неизвестная ошибка ${context}.`;
}

const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate
}) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); 
  const [isPreviewImageLoadingError, setIsPreviewImageLoadingError] = useState(false);
  
  const [markAvatarForDeletionOnSubmit, setMarkAvatarForDeletionOnSubmit] = useState(false); 

  const initialProfileDataRef = useRef<IFullUser | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<{ message: string | null; type: 'info' | 'success' | 'error' }>({ message: null, type: 'info' });

  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.name || '');
      
      let initialAvatar = profile.avatar_path || null;
      // Преобразуем URL при инициализации, если он с бэкенд-префиксом
      if (initialAvatar && S3_BACKEND_URL_PREFIX_TO_REPLACE && PUBLIC_DISPLAY_URL && initialAvatar.startsWith(S3_BACKEND_URL_PREFIX_TO_REPLACE)) {
        initialAvatar = initialAvatar.replace(S3_BACKEND_URL_PREFIX_TO_REPLACE, PUBLIC_DISPLAY_URL);
      }
      setPreviewImage(initialAvatar);
      initialProfileDataRef.current = {...profile, avatar_path: initialAvatar }; // Сохраняем с уже преобразованным URL

      setIsPreviewImageLoadingError(false);
      setMarkAvatarForDeletionOnSubmit(false);
      setSelectedFile(null);
    } else if (!isOpen) {
      setName('');
      setPassword('');
      setShowPassword(false);
      setSelectedFile(null);
      setPreviewImage(null);
      setIsPreviewImageLoadingError(false);
      setMarkAvatarForDeletionOnSubmit(false);
      setError(null);
      setFileStatus({ message: null, type: 'info' });
      initialProfileDataRef.current = null;
      setIsLoading(false);
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
    }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileStatus({ message: null, type: 'info' });
    setError(null);
    setSelectedFile(file);
    setMarkAvatarForDeletionOnSubmit(false);
    setIsPreviewImageLoadingError(false);

    if (file) {
      const maxFileSize = 5 * 1024 * 1024;
      if (file.size > maxFileSize) {
        setFileStatus({ message: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)}MB). Максимум 5MB.`, type: 'error' });
        setSelectedFile(null);
        setPreviewImage(initialProfileDataRef.current?.avatar_path || null);
        setIsPreviewImageLoadingError(!initialProfileDataRef.current?.avatar_path);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setIsPreviewImageLoadingError(false);
      };
      reader.readAsDataURL(file);
      setFileStatus({ message: `Выбран файл: "${file.name}". Он будет загружен при сохранении.`, type: 'info' });
    } else {
      setPreviewImage(initialProfileDataRef.current?.avatar_path || null);
      setIsPreviewImageLoadingError(!initialProfileDataRef.current?.avatar_path);
    }
    if (e.target) e.target.value = '';
  };

  const handleDeleteCurrentAvatarFlag = () => {
    if (!initialProfileDataRef.current?.avatar_path) {
        setFileStatus({ message: "Нет аватара для удаления.", type: 'info' });
        return;
    }
    setMarkAvatarForDeletionOnSubmit(true);
    setPreviewImage(null);
    setIsPreviewImageLoadingError(false); 
    setSelectedFile(null);
    setFileStatus({ message: "Текущий аватар будет удален при сохранении профиля.", type: 'info' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFileStatus({ message: null, type: 'info' });

    if (!initialProfileDataRef.current) {
      setError("Данные профиля не загружены.");
      return;
    }

    const formData = new FormData();
    let hasFormChanges = false;

    const trimmedName = name.trim();
    if (trimmedName !== (initialProfileDataRef.current.name || '')) {
      formData.append('name', trimmedName);
      hasFormChanges = true;
    }
    
    if (password) {
      if (password.length < 6) {
        setError("Новый пароль должен содержать не менее 6 символов.");
        return;
      }
      formData.append('password', password);
      hasFormChanges = true;
    }

    if (selectedFile) {
      formData.append('avatar', selectedFile);
      hasFormChanges = true;
    } else if (markAvatarForDeletionOnSubmit && initialProfileDataRef.current.avatar_path) {
      formData.append('deleteCurrentAvatar', 'true');
      hasFormChanges = true;
    }

    if (!hasFormChanges) {
      setFileStatus({ message: "Нет изменений для сохранения.", type: 'info' });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUserDataFromBackend = await UserService.updateProfile(formData); 
      
      let displayableAvatarUrl = updatedUserDataFromBackend.avatar_path || null;
      if (displayableAvatarUrl && S3_BACKEND_URL_PREFIX_TO_REPLACE && PUBLIC_DISPLAY_URL && displayableAvatarUrl.startsWith(S3_BACKEND_URL_PREFIX_TO_REPLACE)) {
        displayableAvatarUrl = displayableAvatarUrl.replace(S3_BACKEND_URL_PREFIX_TO_REPLACE, PUBLIC_DISPLAY_URL);
      }
      
      const finalProfileDataForCache: IFullUser = {
        ...updatedUserDataFromBackend,
        avatar_path: displayableAvatarUrl,
      };

      setFileStatus({ message: "Профиль успешно обновлен!", type: 'success' });
      setError(null);

      queryClient.setQueryData(PROFILE_QUERY_KEY, finalProfileDataForCache);
      initialProfileDataRef.current = finalProfileDataForCache;
      
      setName(finalProfileDataForCache.name || '');
      setPreviewImage(finalProfileDataForCache.avatar_path || null);
      setIsPreviewImageLoadingError(!finalProfileDataForCache.avatar_path);
      setMarkAvatarForDeletionOnSubmit(false);
      
      if (onProfileUpdate) {
        onProfileUpdate(finalProfileDataForCache);
      }
      setPassword('');
      setSelectedFile(null);
      
      onClose();

    } catch (err: any) {
      const errorMsg = extractErrorMessage(err, "обновления профиля");
      setError(errorMsg);
      setFileStatus({ message: null, type: 'info' });
      setPreviewImage(initialProfileDataRef.current?.avatar_path || null);
      setIsPreviewImageLoadingError(!initialProfileDataRef.current?.avatar_path);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(x => !x);
  
  const isCurrentlyProcessing = isLoading;

  const hasNameChanged = name.trim() !== (initialProfileDataRef.current?.name || '').trim();
  const isAvatarMarkedForChange = !!selectedFile || (markAvatarForDeletionOnSubmit && !!initialProfileDataRef.current?.avatar_path);
  const hasPasswordChanged = Boolean(password);
  const noUnsavedChanges = !hasNameChanged && !isAvatarMarkedForChange && !hasPasswordChanged;
  
  const showDeleteAvatarButton = initialProfileDataRef.current?.avatar_path && !selectedFile && !markAvatarForDeletionOnSubmit;

  const displayStockIcon = !previewImage || isPreviewImageLoadingError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div
        ref={modalContentRef}
        className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-scale-in"
        style={{ animationFillMode: 'forwards' }}
      >
        <button onClick={onClose} disabled={isCurrentlyProcessing} className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" aria-label="Закрыть">
          <FiX size={22} />
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Редактировать профиль
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md flex items-center gap-2 text-sm">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!error && fileStatus.message && fileStatus.type === 'success' && (
             <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-md flex items-center gap-2 text-sm">
                <FiCheckCircle className="flex-shrink-0" />
                <span>{fileStatus.message}</span>
            </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя
            </label>
            <input id="profileName" name="profileName" type="text" value={name} onChange={e => setName(e.target.value)} disabled={isCurrentlyProcessing} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Ваше имя" />
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 -mb-2">
              Аватар
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-11 h-11">
                {displayStockIcon ? (
                  <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-500 text-white ring-2 ring-primary hover:bg-gray-600 transition-colors">
                    <FaUserAlt size={24} />
                  </div>
                ) : (
                  <Image src={previewImage!} alt="Аватар пользователя" width={44} height={44} className="rounded-full w-full h-full object-cover" key={previewImage + (isPreviewImageLoadingError ? '-err' : '-ok')}
                    onError={() => setIsPreviewImageLoadingError(true)}
                    onLoad={() => { if (isPreviewImageLoadingError) setIsPreviewImageLoadingError(false);}}
                  />
                )}
              </div>
              <div className="flex-grow w-full space-y-3 overflow-hidden">
                 <label className={`flex w-full items-center justify-center gap-2 px-3 py-2 border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isCurrentlyProcessing ? 'opacity-50 cursor-not-allowed' : ''} overflow-hidden`}>
                  <FiUploadCloud size={16} className="flex-shrink-0" />
                  <span className="text-sm truncate whitespace-nowrap">{selectedFile?.name || 'Выбрать новый аватар...'}</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" className="sr-only" onChange={handleFileChange} disabled={isCurrentlyProcessing} />
                 </label>
                
                {showDeleteAvatarButton && (
                   <button type="button" onClick={handleDeleteCurrentAvatarFlag} disabled={isCurrentlyProcessing} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                     <FiTrash2 size={16} /> Пометить к удалению
                  </button>
                )}
                {fileStatus.message && fileStatus.type !== 'success' && (
                  <p className={`mt-1 text-xs flex items-center gap-1 ${ fileStatus.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400' }`}>
                    {fileStatus.type === 'error' && <FiAlertCircle size={12} />}
                    {fileStatus.type === 'info' && <FiInfo size={12} />}
                    <span>{fileStatus.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div> 
            <label htmlFor="profilePassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Новый пароль <span className="text-xs text-gray-500">(если нужно изменить)</span></label>
            <div className="relative">
              <input id="profilePassword" name="profilePassword" type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); if (error && password.length >= 5) setError(null);}} disabled={isCurrentlyProcessing} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 pr-10 disabled:opacity-50 disabled:cursor-not-allowed" placeholder="Оставьте пустым, чтобы не менять" autoComplete="new-password"/>
              <button type="button" onClick={toggleShowPassword} disabled={isCurrentlyProcessing} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none rounded-r-md disabled:opacity-50" aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {password && password.length > 0 && password.length < 6 && ( <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"> <FiInfo size={12} /> Пароль должен быть не менее 6 символов.</p>)}
          </div>

          <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} disabled={isCurrentlyProcessing} className="px-4 py-2 bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm">Отмена</button>
              <button type="submit" disabled={isCurrentlyProcessing || noUnsavedChanges} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-1.5">
                {isLoading ? 'Сохранение...' : <><FiSave size={16} /> Сохранить изменения</>}
              </button>
          </div>
        </form>
      </div>
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
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            box-shadow: 0 0 0 30px white inset !important;
             -webkit-text-fill-color: #1f2937 !important;
        }
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active {
             -webkit-box-shadow: 0 0 0 30px #374151 inset !important;
             box-shadow: 0 0 0 30px #374151 inset !important;
             -webkit-text-fill-color: #f3f4f6 !important;
        }
        .text-white { color: white !important; }
      `}</style>
    </div>
  );
};

export default EditProfileModal;