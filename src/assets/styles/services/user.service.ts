// src/assets/styles/services/user.service.ts
import { IFullUser, IUser /*, UserProfileUpdateDto */ } from '@/src/types/user.interface'; // UserProfileUpdateDto больше не нужен для updateProfile
import { instanse } from '../api/api.interceptor';
import { AxiosResponse } from 'axios';

const USERS_ENDPOINT_PREFIX = 'users';

export const UserService = {
  async getProfile(): Promise<IFullUser> {
    const response: AxiosResponse<IFullUser> = await instanse({
      url: `${USERS_ENDPOINT_PREFIX}/profile`,
      method: 'GET',
    });
    return response.data;
  },

  /**
   * Обновление профиля пользователя с использованием FormData.
   * FormData может содержать текстовые поля (name, password, deleteCurrentAvatar)
   * и опционально файл аватара.
   * Бэкенд-эндпоинт PATCH /users/profile/edit должен ожидать multipart/form-data.
   */
  async updateProfile(formData: FormData): Promise<IFullUser> { // <--- ИЗМЕНЕНИЕ: принимает FormData
    const response: AxiosResponse<IFullUser> = await instanse.patch<IFullUser>( // Используем instanse.patch для удобства
      `${USERS_ENDPOINT_PREFIX}/profile/edit`,
      formData, // Отправляем FormData напрямую
      {
        headers: {
          // 'Content-Type': 'multipart/form-data' 
          // Axios обычно устанавливает этот заголовок автоматически для FormData,
          // но если возникают проблемы, можно раскомментировать и указать явно.
          // Однако, явное указание может иногда мешать Axios'у правильно установить boundary.
        },
      }
    );
    return response.data;
  },

  async toggleFavorite(productId: string | number): Promise<IUser> { // Или IFullUser
    const response: AxiosResponse<IUser> = await instanse({
      url: `${USERS_ENDPOINT_PREFIX}/profile/favorites/${productId}`,
      method: 'PATCH',
    });
    return response.data;
  },
};