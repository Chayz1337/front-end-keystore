import { instanse } from '../api/api.interceptor';
import { IFullUser, IUser } from '@/src/types/user.interface';

type TypeData = {
    email: string
    password?: string
    name?: string
    avatarPath?: string
    phone?: string
}
const USERS = 'users'

export const UserService = {
    async getProfile() {
        return instanse <IFullUser>({
            url: `${USERS}/profile`,
            method: 'GET'
        })
    },

    async updateProfile(data: TypeData) {
        return instanse <IUser>({
            url: `${USERS}/profile}`,
            method: 'PUT',
            data
        })
    },
    async toggleFavorite(productId: string | number) {
        return instanse <IUser>({
            url: `${USERS}/profile/favorites/${productId}`,
            method: 'PATCH'
        })
    },
}


