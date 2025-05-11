// src/types/user.interface.ts
import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface";

export interface IUser {
    id: number;
    email: string;
    name: string;
    avatarPath: string | null;
    phone: string;
}

export interface IFullUser extends IUser {
    favorites: IProduct[];
    orders: IOrder[];
}

export type UserProfileUpdateDto = {
    name?: string;
    avatar_path?: string;
    password?: string;
};
