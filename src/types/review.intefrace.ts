import { IUser } from "./user.interface"

export interface IReview {
    review_id: number
    rating: number
    comment: string
    created_at: string
    user: {
      user_id: number
      name: string
      email: string
      avatar_path: string
    }
    game: {
      game_id: number
      name: string
      slug: string
    }
  }
  