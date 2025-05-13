// src/store/user/user.interface.ts
import { IUser } from '@/src/types/user.interface'; // <--- Импортируем глобальный IUser

// export interface IUserState { ... } // Этот тип больше не нужен для state.user

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface IInitialState {
    user: IUser | null; // <--- Используем IUser
    isLoading: boolean;
    error?: string | null;
    // Если isAdmin и role не часть IUser, но нужны в стейте отдельно:
    // isAdmin?: boolean;
    // role?: string;
}

export interface IEmailPassword {
    email: string;
    password?: string; // Сделал опциональным, как было раньше, на случай если это важно
}

export interface IAuthResponse extends ITokens {
    user: IUser; // Это уже правильно
}