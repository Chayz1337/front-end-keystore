// src/store/user/user.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInitialState } from './user.interface';
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
    // экшен для ручной очистки ошибки
    clearAuthError(state) {
      state.error = null;
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
        // payload при rejectWithValue — строка
        state.error = action.payload || action.error.message || 'Ошибка регистрации';
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
        state.error = action.payload || action.error.message || 'Ошибка входа';
      })

      // logout
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = null;
      })

      // checkAuth
      .addCase(checkAuth.pending, state => {
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Ошибка проверки сессии';
      });
  },
});

export const { clearAuthError } = userSlice.actions;
export default userSlice.reducer;
