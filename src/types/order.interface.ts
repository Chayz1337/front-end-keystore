// src/types/order.interface.ts
import { ICartItem } from "./cart.inteface";
import { IUser } from "./user.interface"; // IUser больше не нужен напрямую в IOrder таким образом

export enum EnumOrderStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}
export interface ICreateOrderResponse { /* ... как было ... */ }
export interface IOrderGameKeyItem { /* ... как было ... */ }
export interface IOrderPayment { /* ... как было ... */ }

export interface IOrder {
  order_id: number;
  created_at: string;
  order_items: {
    order_item_id: number;
    quantity: number;
    price: number;
    game_id: number;
    game: {
      game_id: number;
      name: string;
    };
  }[];
  status: EnumOrderStatus;
  user: IUser | null;
  total_amount: number;
  order_keys?: IOrderGameKeyItem[];
  payments?: IOrderPayment[];
}