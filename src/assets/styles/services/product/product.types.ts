import { IProduct } from "@/src/types/product.interdace"

export type TypeProductData = {
    name: string
    price: number
    description?: string
    images: string[]
    category_id: number
}
export const PRODUCTS = 'games'

export type TypeProductDataFilters = {
    sort?: EnumProductSort
    searchTerm?: string
    page?: string | number
    perPage?: string | number
    ratings?: string
    minPrice?: string
    maxPrice?: string
    categoryId?: string
}

export enum EnumProductSort {
    HIGH_PRICE = 'high-price',
    LOW_PRICE = 'low-price',
    NEWEST = 'newest',
    OLDEST = 'oldest'
}

export type TypeParamsFilters = {
    searchParams: TypeProductDataFilters
}