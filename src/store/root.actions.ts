import *as userActions from './user/user.actions'

import { cartSlice } from './cart/cart.slice'
import { filtersSlice } from './filters/filters.slice'
export const rootActions = {
    ...userActions,
    ...cartSlice.actions,
    ...filtersSlice.actions
}