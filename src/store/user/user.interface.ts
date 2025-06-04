// src/store/user/user.interface.ts
import { IUser as GlobalIUser } from '@/src/types/user.interface'; // Импортируем с псевдонимом

// Реэкспортируем его под именем IUser
export type IUser = GlobalIUser; 
// Или, если ты хочешь сохранить его как интерфейс, а не тип:
// export interface IUser extends GlobalIUser {} 
// (Но первый вариант с type IUser = GlobalIUser; проще и обычно работает)


export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface IInitialState {
    user: IUser | null; // Теперь это будет ссылаться на реэкспортированный IUser
    isLoading: boolean;
    error?: string | null;
}

export interface IEmailPassword {
    email: string;
    password?: string; 
}

export interface IAuthResponse extends ITokens {
    user: IUser; // И это тоже
}