// src/store/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST, persistReducer,
    persistStore, PURGE,
    REGISTER,
    REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userSlice } from './user/user.slice';
import { cartSlice } from './cart/cart.slice';
import { filtersSlice } from './filters/filters.slice';
// УБИРАЕМ ИМПОРТ: import { cartUserPersistenceMiddleware } from './cartPersistenceMiddleware';

const persistConfig = {
    key: 'hey-storev1',
    storage,
    whitelist: ['cart'] // redux-persist будет сохранять только 'cart' слайс
};

const rootReducer = combineReducers({
    cart: cartSlice.reducer,
    user: userSlice.reducer,
    filters: filtersSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, REGISTER, PERSIST, PURGE]
            }
        }) // .concat(cartUserPersistenceMiddleware) <--- УБИРАЕМ ЭТУ ЧАСТЬ
});

export const persistor = persistStore(store);
export type TypeRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch; // Добавим на всякий случай