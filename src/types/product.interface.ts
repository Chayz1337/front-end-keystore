import { ICategoryGames } from "./category.interface"
import { IReview } from "./review.intefrace"

export interface IProduct {
    game_id: number
    name: string
    slug: string
    description: string
    price: number
    reviews: IReview[]
    images: string[]
    created_at: string
    availableKeys: number | null;
    game_categories: ICategoryGames[]
}

export interface IProductDetails {
    games: IProduct
}


export type TypeProducts = {
    games: IProduct[]
}
export type TypePaginationProducts = {
    total?: number
    length: number
    games: IProduct[]
}