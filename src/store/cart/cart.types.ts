import { ICartItem } from "@/src/types/cart.inteface";

export interface ICartInitialState {
  items: ICartItem[];
}

export interface IAddToCartPayload extends Omit<ICartItem, 'id'> {}
export interface IChangeQuantityPayload {
  id: number;
  type: 'minus' | 'plus';
}
