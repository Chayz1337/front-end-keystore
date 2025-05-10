// src/store/user/user.actions.ts
 // ПРОВЕРЬ ПУТЬ
import { IAuthResponse, IEmailPassword} from './user.interface'; // ПРОВЕРЬ ПУТЬ
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorCatch } from '@/src/assets/styles/api/api.helper';
import { removeFromStorage } from '@/src/assets/styles/services/auth/auth.helper';
import { AuthService } from '@/src/assets/styles/services/auth/auth.service';


/* register */
export const register = createAsyncThunk<IAuthResponse, IEmailPassword, { rejectValue: string }>(
    'auth/register',
    async (data, thunkApi) => {
        try {
            const response = await AuthService.mainModule('register', data);
            // Важно: AuthService.mainModule должен возвращать данные, совместимые с IAuthResponse,
            // обычно это { user: IUser, accessToken: string }
            return response;
        } catch (error: any) {
            const errorMessage = errorCatch(error); // Используем errorCatch для извлечения сообщения
            console.error('Ошибка в register thunk:', errorMessage, 'Полная ошибка:', error.response?.data || error);
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
);

/* login */
export const login = createAsyncThunk<IAuthResponse, IEmailPassword, { rejectValue: string }>(
    'auth/login',
    async (data, thunkApi) => {
        try {
            const response = await AuthService.mainModule('login', data);
            // Успешный ответ должен содержать user и accessToken, как в IAuthResponse
            return response;
        } catch (error: any) {
            // Извлекаем сообщение об ошибке.
            // errorCatch - твой хелпер. Убедись, что он возвращает строку.
            // Или извлекай сообщение напрямую из error.response.data.message
            const errorMessage = errorCatch(error);
            console.error('Ошибка в login thunk:', errorMessage, 'Полная ошибка:', error.response?.data || error);
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
);

/* logout */
export const logout = createAsyncThunk('auth/logout', async () => {
    removeFromStorage();
    // Здесь можно добавить другие действия при логауте, если нужно
    // например, сброс состояния пользователя в сторе.
});

/* checkAuth */
export const checkAuth = createAsyncThunk<IAuthResponse, void, { rejectValue: string }>(
    'auth/check-auth',
    async (_, thunkApi) => {
        try {
            // getNewTokens должен возвращать { data: IAuthResponse } или аналогично
            const response = await AuthService.getNewTokens();
            return response.data; // Убедись, что структура соответствует IAuthResponse
        } catch (error: any) {
            const errorMessage = errorCatch(error);
            console.error('Ошибка в checkAuth thunk:', errorMessage, 'Полная ошибка:', error.response?.data || error);
            if (errorMessage.toLowerCase().includes('jwt expired') || errorMessage.toLowerCase().includes('unauthorized')) {
                // При ошибке токена (например, истек) также вызываем logout,
                // чтобы очистить хранилище и состояние.
                // dispatch(logout()) здесь может быть избыточен, если checkAuth.rejected обработчик делает это
                // thunkApi.dispatch(logout()); // Это правильно, если logout обрабатывает UI (например, редирект)
            }
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
);