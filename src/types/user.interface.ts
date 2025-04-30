import { IOrder } from "./order.intefrace"
import { IProduct } from "./product.interface";

export interface IUser {
    id: number;
    email: string;
    name: string;
    avatarPath: string | null; // или string | undefined, если это поле может быть неопределённым
    phone: string;
}


export interface IFullUser extends IUser {
    favorites: IProduct[]
    orders: IOrder[]
}