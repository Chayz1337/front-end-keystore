import { instanse } from '../api/api.interceptor';
import { IFullUser, IUser } from '@/src/types/user.interface';

type TypeData = {
  email: string;
  password?: string;
  name?: string;
  avatarPath?: string;
  phone?: string;
};

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
  async updateProfile(data: TypeData) {
    return instanse<IUser>({
      url: `${USERS}/profile`, // исправлено: убрана лишняя }
      method: 'PUT',
      data,
    });
  },

  /** Добавление/удаление игры из избранного */
  async toggleFavorite(productId: string | number) {
    return instanse<IUser>({
      url: `${USERS}/profile/favorites/${productId}`,
      method: 'PATCH',
    });
  },
};
