
import { ICartItem } from "@/src/types/cart.inteface";
import { Game } from "@/src/types/game-key.interface";

// Состояние корзины
export interface ICartInitialState {
    items: ICartItem[];
}

// Payload для добавления товара в корзину
export interface IAddToCartPayload {
  games: Game;       // Объект игры
  quantity: number;  // Количество (обычно 1 при добавлении)
  price: number;     // Цена
  availableStock: number; // <--- ДОБАВЬ ЭТУ СТРОКУ
}


// Payload для изменения количества
export interface IChangeQuantityPayload {
    id: number; // ID элемента в корзине (из ICartItem)
    type: 'plus' | 'minus';
}

// Payload для удаления (если используете)
export interface IRemoveFromCartPayload {
    id: number; // ID элемента в корзине (из ICartItem)
}