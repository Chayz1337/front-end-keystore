// src/store/user/user.actions.ts
import { IAuthResponse, IEmailPassword } from './user.interface';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorCatch } from '@/src/assets/styles/api/api.helper';
import { removeFromStorage, saveToStorage as saveAuthToStorage } from '@/src/assets/styles/services/auth/auth.helper';
import { AuthService } from '@/src/assets/styles/services/auth/auth.service';
import { reset as resetCart } from '../cart/cart.slice'; // Только resetCart
// Убираем импорты TypeRootState, ICartItem, если они больше не нужны здесь
// import { TypeRootState, AppDispatch } from '../store'; // Если не используем getState

/* register */
export const register = createAsyncThunk<
    IAuthResponse,
    IEmailPassword,
    { rejectValue: string; dispatch: any } // Убрали getState, если не нужен
>(
    'auth/register',
    async (data, thunkApi) => {
        try {
            const response = await AuthService.mainModule('register', data);
            saveAuthToStorage(response);
            thunkApi.dispatch(resetCart()); // Очищаем корзину при регистрации нового пользователя
            return response;
        } catch (error: any) {
            const errorMessage = errorCatch(error);
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
);

/* login */
export const login = createAsyncThunk<
    IAuthResponse,
    IEmailPassword,
    { rejectValue: string; dispatch: any } // Убрали getState, если не нужен
>(
    'auth/login',
    async (data, thunkApi) => {
        try {
            const response = await AuthService.mainModule('login', data);
            saveAuthToStorage(response);
            // При логине корзина НЕ загружается из персонального хранилища,
            // она будет такой, какой ее оставил redux-persist (или пустой, если persist выключен для cart).
            // Если redux-persist сохраняет 'cart', то при логине отобразится корзина,
            // которая была в localStorage под ключом redux-persist.
            // Если вы хотите, чтобы при каждом логине корзина была чистой, раскомментируйте:
            // thunkApi.dispatch(resetCart());
            return response;
        } catch (error: any) {
            const errorMessage = errorCatch(error);
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
);

/* logout */
export const logout = createAsyncThunk<
    void,
    void,
    { dispatch: any } // Убрали getState
>(
    'auth/logout',
    async (_, thunkApi) => {
        removeFromStorage(); // Удаляем токены и инфо о пользователе
        thunkApi.dispatch(resetCart()); // Просто очищаем корзину в Redux
        console.log('[Logout] Пользователь вышел, хранилище очищено, корзина Redux сброшена.');
    }
);

/* checkAuth (восстановление сессии) */
export const checkAuth = createAsyncThunk<
    IAuthResponse,
    void,
    { rejectValue: string; dispatch: any } // Убрали getState, если не нужен
>(
    'auth/check-auth',
    async (_, thunkApi) => {
        try {
            const response = await AuthService.getNewTokens();
            saveAuthToStorage(response.data);
            // При checkAuth корзина НЕ загружается из персонального хранилища.
            // redux-persist сам восстановит корзину, которая была сохранена для текущей сессии.
            // Если вы хотите всегда сбрасывать корзину при checkAuth (маловероятно), раскомментируйте:
            // thunkApi.dispatch(resetCart());
            return response.data;
        } catch (error: any) {
            const errorMessage = errorCatch(error);
            if (typeof errorMessage === 'string' && (errorMessage.toLowerCase().includes('jwt') || errorMessage.toLowerCase().includes('unauthorized'))) {
                console.log('[CheckAuth] Ошибка токена, вызываем logout...');
                // logout теперь просто очистит хранилище и корзину
                await thunkApi.dispatch(logout());
            }
            return thunkApi.rejectWithValue(errorMessage);
        }
    }
);