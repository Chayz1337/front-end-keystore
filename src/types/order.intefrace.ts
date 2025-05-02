import { ICartItem } from "./cart.inteface"
import { IUser } from "./user.interface"

export enum EnumOrderStatus {
    PENDING = 'PENDING',
    PAYED = 'PAYED'
}


export interface IOrder {
    order_id: number
    created_at: string
    items: ICartItem[]
    status: EnumOrderStatus
    user: IUser
    total_amount: number

}