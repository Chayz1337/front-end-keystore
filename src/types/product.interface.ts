// src/types/product.interface.ts
import { ICategoryGames } from "./category.interface"; // Убедись, что путь верный
import { IReview } from "./review.intefrace"; // ПРОВЕРЬ ОПЕЧАТКУ: intefrace -> interface

export interface IProduct {
    stock: number; // количество доступных ключей
    game_id: number;
    name: string;
    slug: string;
    description: string; // Оставим обязательным здесь, но sanitizeProduct обработает undefined/null от API
    price: number;
    reviews: IReview[];
    images: string[];
    created_at: string; // Дата создания
    game_categories: ICategoryGames[];
  }

// Остальные интерфейсы/типы без изменений
export interface IProductDetails {
    games: IProduct; // Обычно содержит один продукт? Может лучше IProduct?
}

export type TypeProducts = {
    games: IProduct[];
}
export type TypePaginationProducts = {
    lengh?: number;
    length: number;
    games: IProduct[];
}