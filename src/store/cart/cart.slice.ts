// src/store/cart/cart.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddToCartPayload, ICartInitialState, IChangeQuantityPayload } from './cart.types'; // Убедись в импортах
import { ICartItem } from '@/src/types/cart.inteface'; // Импорт ICartItem

const initialState: ICartInitialState = { items: [] };

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<IAddToCartPayload>) => {
            console.log('[cart.slice] addToCart PAYLOAD:', action.payload); // Отладка

             // Проверка безопасности: Убедимся, что availableStock пришел как число
             if (typeof action.payload.availableStock !== 'number') {
                 console.error('[cart.slice] ОШИБКА: Попытка добавить товар без availableStock!', action.payload);
                 return; // Не добавляем товар, если данные некорректны
             }

            const isExist = state.items.some(
                item => item.games.game_id === action.payload.games.game_id
            );
            if (!isExist) {
                // Создаем новый элемент ЯВНО со всеми полями ICartItem
                 const newItem: ICartItem = {
                     id: Date.now(),
                     games: action.payload.games,
                     quantity: action.payload.quantity,
                     price: action.payload.price,
                     availableStock: action.payload.availableStock // <--- ИЗМЕНЕНИЕ: Сохраняем поле
                 };
                state.items.push(newItem); // Добавляем полностью сформированный объект
            } else {
                console.warn(`Игра с ID ${action.payload.games.game_id} уже в корзине.`);
            }
        },

        // --- Остальные редьюсеры (changeQuantity, removeFromCart, reset) ---
        // --- НЕ ТРЕБУЮТ ИЗМЕНЕНИЙ ДЛЯ ЭТОЙ ЛОГИКИ ---
        changeQuantity: (state, action: PayloadAction<IChangeQuantityPayload>) => {
            const { id, type } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (type === 'plus') {
                    // Сама ПРОВЕРКА происходит в CartActions ПЕРЕД вызовом этого редьюсера
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
        }
    }
});

// Экспорты actions и reducer
export const { addToCart, removeFromCart, changeQuantity, reset } = cartSlice.actions;
export default cartSlice.reducer;