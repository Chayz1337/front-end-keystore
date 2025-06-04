// src/store/user/user.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState, IAuthResponse, IUser } from './user.interface'; // Убедись, что IAuthResponse и IUser импортированы
import { register, login, logout, checkAuth } from './user.actions';
import { getStoreLocal } from '@/src/utils/local-storage';

const initialState: IInitialState = {
  user: getStoreLocal('user'),
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Экшен для ручной очистки ошибки
    clearAuthError(state) {
      state.error = null;
    },
    // ===>>> ВОТ ЭТОТ РЕДЬЮСЕР НУЖНО ДОБАВИТЬ <<<===
    setAuthStateFromOAuth: (state, action: PayloadAction<IAuthResponse>) => {
      state.user = action.payload.user;
      state.isLoading = false; 
      state.error = null;
      // Токены уже должны быть сохранены в cookies/localStorage хелпером saveToStorage
    },
  },
  extraReducers: builder => {
    builder
      // register
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || (action.error.message as string) || 'Ошибка регистрации';
      })

      // login
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = (action.payload as string) || (action.error.message as string) || 'Ошибка входа';
      })

      // logout
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
        state.error = null; 
      })

      // checkAuth
      .addCase(checkAuth.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = (action.payload as string) || (action.error.message as string) || 'Ошибка проверки сессии';
      });
  },
});

// ===>>> И ДОБАВЬ ЕГО В ЭКСПОРТ <<<===
export const { clearAuthError, setAuthStateFromOAuth } = userSlice.actions;
export default userSlice.reducer;