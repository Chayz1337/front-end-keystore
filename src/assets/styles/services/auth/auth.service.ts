import { IAuthResponse, IEmailPassword } from '../../../../store/user/user.interface';
import { saveToStorage } from './auth.helper';
import Cookies from 'js-cookie';
import { axiosClassic } from '../../api/api.interceptor';



export const AuthService = {
    async mainModule(type: 'login' | 'register', data: IEmailPassword) {
        const response = await axiosClassic<IAuthResponse>({
            url: `/auth/${type}`,
            method: 'POST',
            data
        })

        if (response.data.accessToken) saveToStorage(response.data)
            return response.data
    },
    async getNewTokens() {
        const refreshToken = Cookies.get('refreshToken')
        const response = await axiosClassic.post<string, {data:
        IAuthResponse}> (
            '/auth/login/access-token',
            {refreshToken}
        ) 
        if   (response.data.accessToken) saveToStorage(response.data)
            return response
    }
}

