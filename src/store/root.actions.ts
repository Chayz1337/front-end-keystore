// src/store/root-actions.ts (как было, и это ПРАВИЛЬНО)
import *as userActions from './user/user.actions'
import { userSlice } from './user/user.slice'; // Предположим, это тоже было для синхронных

import { cartSlice } from './cart/cart.slice'
import { filtersSlice } from './filters/filters.slice'

export const rootActions = {
    ...userActions,
    ...userSlice.actions, // Если были синхронные экшены пользователя
    ...cartSlice.actions,    // Здесь будут addToCart, removeFromCart, reset (из cart) и т.д.
    ...filtersSlice.actions  // Здесь будут updateQueryParam, resetFilterUpdate, resetFilters и т.д.
}