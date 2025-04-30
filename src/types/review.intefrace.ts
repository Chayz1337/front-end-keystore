import { IUser } from "./user.interface"

export interface IReview {
    productId: number
    id: number
    user: IUser
    createdAt: string
    text: string
    rating: number
}