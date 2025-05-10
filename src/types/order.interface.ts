// src/types/order.interface.ts
import { ICartItem } from "./cart.inteface";
import { IUser } from "./user.interface";

export enum EnumOrderStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}
export interface ICreateOrderResponse {
    url: string;                 // Ссылка на оплату Stripe
    expires_at?: number;        // Время истечения сессии Stripe (Unix timestamp в секундах)
    order_id: number;            // ID созданного заказа
    status: EnumOrderStatus;     // Статус созданного заказа (обычно PENDING)
    total_amount: number;        // Общая сумма заказа
    // orderItems?: { game_id: number; quantity: number; price: number; }[]; // Опционально, если бэкенд возвращает и это
}

export interface IOrderGameKeyItem {
  game_id: number; // Добавим ID игры для связи, если потребуется
  game: {
    name: string;
  };
  activation_keys: string[];
  quantity: number; // Сколько ключей для этой игры
}

// Опишем структуру платежа, как ее возвращает бэкенд
export interface IOrderPayment {
  payment_id: number;
  status: string; // Или ваш EnumPaymentStatus
  session_url?: string | null;
  created_at: string;
  // другие поля платежа, если есть
}

export interface IOrder {
  order_id: number;
  created_at: string;
  // items: ICartItem[]; // Это поле часто называют order_items на бэкенде
  order_items: { // Предположим, что бэкенд возвращает order_items
    order_item_id: number;
    quantity: number;
    price: number;
    game_id: number;
    game: {
      game_id: number;
      name: string;
      // другие нужные поля игры
    };
  }[];
  status: EnumOrderStatus;
  user: IUser; // Обычно на бэкенде это user_id, а сам объект user может не приходить в списке заказов
  total_amount: number;

  order_keys?: IOrderGameKeyItem[]; // Ключи активации (остается)
  
  // ЗАМЕНА payment_url на массив payments
  // payment_url?: string; // Это поле было избыточным, если есть payments
  payments?: IOrderPayment[]; // Массив платежей, связанных с заказом
}