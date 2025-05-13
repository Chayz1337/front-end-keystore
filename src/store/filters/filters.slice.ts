// src/store/filters/filtersSlice.ts (или filters.slice.ts)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFiltersActionsPayload, IFiltersState } from "./filter.types";
import { EnumProductSort } from "@/src/assets/styles/services/product/product.types";

// ИЗМЕНЕНИЕ ЗДЕСЬ: добавьте 'export'
export const initialState: IFiltersState = { // <--- ДОБАВЬТЕ 'export'
  isFilterUpdated: false,
  queryParams: {
    sort: EnumProductSort.NEWEST,
    searchTerm: '',
    page: 1,
    perPage: 20,
    rating: undefined,
    // minPrice, maxPrice, category_id можно инициализировать, если нужно
  },
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState, // Теперь используется экспортированный initialState
  reducers: {
    updateQueryParam: (state, action: PayloadAction<IFiltersActionsPayload>) => {
      const { key, value } = action.payload;

      if (key === 'rating') {
        if (value === '' || value === null || value === undefined) {
          state.queryParams.rating = undefined;
        } else {
          const numValue = parseInt(String(value), 10);
          state.queryParams.rating = isNaN(numValue) ? undefined : numValue;
        }
      } else if (key === 'page' || key === 'perPage') {
        state.queryParams[key] = Number(value);
      } else {
        state.queryParams[key] = value as any;
      }
      state.isFilterUpdated = true;
    },
    resetFilterUpdate: state => {
      state.isFilterUpdated = false;
    },
    resetFilters: state => {
      state.queryParams.sort = EnumProductSort.NEWEST;
      state.queryParams.searchTerm = '';
      state.queryParams.rating = undefined;
      state.queryParams.minPrice = undefined;
      state.queryParams.maxPrice = undefined;
      state.queryParams.category_id = undefined;
      state.queryParams.page = 1;
      state.isFilterUpdated = true;
    },
  },
});

export const { updateQueryParam, resetFilterUpdate, resetFilters } = filtersSlice.actions;

// Если вы также экспортируете редьюсер по умолчанию, это остается без изменений
// export default filtersSlice.reducer;