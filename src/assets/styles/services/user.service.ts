// Убедитесь, что путь к api.interceptor корректен
 // Примерный путь, исправьте на ваш
import { IFullUser, IUser, UserProfileUpdateDto } from '@/src/types/user.interface';
import { instanse } from '../api/api.interceptor';

const USERS = 'users';

export const UserService = {
  /** Получение профиля пользователя (включает избранное) */
  async getProfile() {
    return instanse<IFullUser>({
      url: `${USERS}/profile`,
      method: 'GET',
    });
  },

  /** Обновление профиля пользователя */
  async updateProfile(data: UserProfileUpdateDto) {
    // Здесь мы ОЖИДАЕМ, что API вернет IFullUser
    // Если это не так, см. комментарии в EditProfileModal.tsx
    return instanse<IFullUser>({
      url: `${USERS}/profile/edit`,
      method: 'PATCH',
      data,
    });
  },

  /** Добавление/удаление игры из избранного */
  async toggleFavorite(productId: string | number) {
    // Предполагаем, что этот эндпоинт может возвращать IUser или только обновленный IFullUser.
    // Если он возвращает IFullUser, измените на instanse<IFullUser>
    return instanse<IUser>({ // Или IFullUser, если API возвращает полный профиль
      url: `${USERS}/profile/favorites/${productId}`,
      method: 'PATCH',
    });
  },
};