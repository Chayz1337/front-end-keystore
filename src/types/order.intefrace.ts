import { ICartItem } from "./cart.inteface"
import { IUser } from "./user.interface"

export enum EnumOrderStatus {
    PENDING = 'PENDING',
    PAYED = 'PAYED'
}


export interface IOrder {
    id: number
    createdAt: string
    items: ICartItem[]
    status: EnumOrderStatus
    user: IUser
    total: number

}