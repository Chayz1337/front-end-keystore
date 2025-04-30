export interface IOrderRequest {
    items: {
      game_id: number;
      quantity: number;
    }[];
  }