import { IProduct } from "./product.interdace"

export interface ICartItem{
    id: number
    games: IProduct
    quantity: number
    price: number
}