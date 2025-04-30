import { Reducer } from './../../node_modules/redux/src/types/reducers';

import { combineReducers, configureStore } from '@reduxjs/toolkit/react'
import { userAgent } from 'next/server'
import {
    FLUSH,
    PAUSE,
    PERSIST, persistReducer,
    persistStore, PURGE,
    REGISTER,
    REHYDRATE
} from 'redux-persist'

import storage from 'redux-persist/lib/storage'
import { userSlice } from './user/user.slice';
import { cartSlice } from './cart/cart.slice';
import { filtersSlice } from './filters/filters.slice';

const persistConfig = {
    key: 'hey-storev1',
    storage,
    whitelist: ['cart']
}

const rootReducer = combineReducers({
    cart: cartSlice.reducer,
    /*carousel: carouselSlice.reducer,*/
    user: userSlice.reducer,
    filters: filtersSlice.reducer
})

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, REGISTER, PERSIST, PURGE]
            }
        })
})

export const persistor = persistStore(store)
export type TypeRootState = ReturnType<typeof rootReducer>