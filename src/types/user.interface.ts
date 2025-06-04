// src/types/user.interface.ts
import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface"; // Предполагается, что IProduct это твоя игра/товар

export enum EnumRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}

export interface IUser {
    id: number;
    email: string;
    name: string | null; // Имя может быть null, если не установлено
    avatar_path: string | null; // avatar_path может быть null
    phone?: string | null;
    role?: EnumRole | string; // Может быть EnumRole или просто строкой, если не всегда Enum
    provider?: string | null;
}

export interface IFullUser extends IUser {
    favorites: IProduct[]; // Убедись, что IProduct это правильный тип для избранного
    orders: IOrder[];
}

export type UserProfileUpdateDto = {
    name?: string | null; // Позволим null, если имя может быть сброшено
    avatar_path?: string | null; // <--- ИЗМЕНЕНИЕ: Позволяем null
    password?: string;
};