// src/types/product.types.ts (или ваш путь к этому файлу)
// import { IProduct } from "@/src/types/product.interface"; // Если IProduct используется где-то еще, оставьте

export type TypeProductData = { // Этот тип не меняется в рамках текущей задачи
    name: string;
    price: number;
    description?: string;
    images: string[];
    categories: number[]; // Раньше был category_id, теперь массив categories
};

export const PRODUCTS = 'games'; // Константа остается

// Обновленный EnumProductSort
export enum EnumProductSort {
    HIGH_PRICE = 'high-price',
    LOW_PRICE = 'low-price',
    NEWEST = 'newest',
    OLDEST = 'oldest',
    HIGHEST_RATED = 'highest-rated', // Добавлено
    LOWEST_RATED = 'lowest-rated',   // Добавлено
}

// Обновленный TypeProductDataFilters
export type TypeProductDataFilters = {
    sort?: EnumProductSort;
    searchTerm?: string;
    page?: string | number; // В стейте лучше хранить как number, в URL будет string
    perPage?: string | number; // Аналогично page
    // Было: ratings?: string;
    rating?: number;         // Стало: rating (число, для одного конкретного рейтинга)
    minPrice?: string;
    maxPrice?: string;
    category_id?: number; // Оставляем, если этот фильтр еще используется для чего-то
                           // Если он связан с categories в TypeProductData, логика фильтрации на бэке должна это поддерживать
};

// Этот тип не меняется в рамках текущей задачи
export type TypeParamsFilters = {
    searchParams: TypeProductDataFilters;
};