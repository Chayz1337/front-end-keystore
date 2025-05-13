// src/store/cart/cart.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddToCartPayload, ICartInitialState, IChangeQuantityPayload } from './cart.types';
import { ICartItem } from '@/src/types/cart.inteface';

const initialState: ICartInitialState = { items: [] };

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IAddToCartPayload>) => {
            console.log('[cart.slice] addToCart PAYLOAD:', action.payload);

            if (typeof action.payload.availableStock !== 'number') {
                console.error('[cart.slice] ОШИБКА: Попытка добавить товар без availableStock!', action.payload);
                return;
            }

            const isExist = state.items.some(
                item => item.games.game_id === action.payload.games.game_id
            );
            if (!isExist) {
                const newItem: ICartItem = {
                    id: Date.now(), // Рассмотрите более надежный способ генерации ID, если это критично
                    games: action.payload.games,
                    quantity: action.payload.quantity,
                    price: action.payload.price,
                    availableStock: action.payload.availableStock
                };
                state.items.push(newItem);
            } else {
                console.warn(`Игра с ID ${action.payload.games.game_id} уже в корзине.`);
            }
        },
        changeQuantity: (state, action: PayloadAction<IChangeQuantityPayload>) => {
            const { id, type } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (type === 'plus') {
                    item.quantity++;
                } else if (type === 'minus') {
                    if (item.quantity > 1) {
                        item.quantity--;
                    }
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        reset: state => {
            state.items = [];
        },
        // ===>>> НОВЫЙ РЕДЬЮСЕР <<<===
        setCartItems: (state, action: PayloadAction<ICartItem[]>) => {
            state.items = action.payload;
        }
    }
});

// Экспортируем новый action
export const { addToCart, removeFromCart, changeQuantity, reset, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;