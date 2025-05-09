// src/types/order.intefrace.ts
import { ICartItem } from "./cart.inteface"; // Убедись, что путь правильный и ICartItem определен
import { IUser } from "./user.interface";   // Убедись, что путь правильный и IUser определен

export enum EnumOrderStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  // Если у тебя могут быть другие статусы, добавь их сюда
  // Например: FAILED = 'FAILED', CANCELLED = 'CANCELLED'
}

/**
 * Описывает структуру объекта с ключами для одной игры в заказе.
 */
export interface IOrderGameKeyItem {
  game: {
    name: string;
    // game_id?: number; // Если нужно ID игры здесь
    // ... другие свойства игры, которые могут понадобиться при отображении ключей
  };
  activation_keys: string[]; // Массив строковых ключей для этой игры
}

export interface IOrder {
  order_id: number;
  created_at: string; // Рекомендуется использовать тип Date или string в формате ISO
  items: ICartItem[]; // Массив товаров в заказе
  status: EnumOrderStatus; // Статус заказа
  user: IUser; // Информация о пользователе, сделавшем заказ
  total_amount: number; // Общая сумма заказа

  // Добавленные поля:
  order_keys?: IOrderGameKeyItem[]; // Ключи активации для заказа (опционально, т.к. их может не быть для PENDING)
  payment_url?: string;             // Ссылка на оплату для PENDING заказов (опционально)
}