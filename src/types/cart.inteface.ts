import { IProduct } from "./product.interface"

export interface ICartItem{
    id: number
    games: IProduct
    quantity: number
    price: number
    
}