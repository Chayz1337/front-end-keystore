export interface GameKey {
    key_id: number;
    created_at: string; // или Date, если ты приводишь к объекту
    activation_key: string;
    is_used: boolean;
    game: Game;
  }
  
  export interface Game {
    stock: number;
    game_id: number;
    created_at: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    game_categories: GameCategoryRelation[];
    reviews: GameReview[];
  }
  
  export interface GameCategoryRelation {
    category: Category;
  }
  
  export interface Category {
    category_id: number;
    category_name: string;
    slug: string;
  }
  
  export interface GameReview {
    user: User;
    game: {
      game_id: number;
      name: string;
      slug: string;
    };
    created_at: string;
    rating: number;
    comment: string;
    review_id: number;
  }
  
  export interface User {
    user_id: number;
    email: string;
    avatar_path: string;
  }
  