import { Game } from "./game-key.interface";

export interface ICartItem {
    id: number;
    games: Game; // Содержит основную инфу о игре, БЕЗ реального stock
    quantity: number;
    price: number;
    availableStock: number; // <<< Количество, доступное пользователю на момент добавления
}