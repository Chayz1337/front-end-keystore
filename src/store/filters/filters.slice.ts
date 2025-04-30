import { EnumProductSort } from "@/src/assets/styles/services/product/product.types";
import { IFiltersActionsPayload, IFiltersState } from "./filter.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IFiltersState = {
    isFilterUpdated: false,
    queryParams: {
      sort: EnumProductSort.NEWEST,
      searchTerm: '',
      page: 1,
      perPage: 20,
      ratings: ''
    },
  };
  
  export const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
      updateQueryParam : (state, action: PayloadAction <IFiltersActionsPayload>) => {
        const {key, value} = action.payload
        state.queryParams[key] = value as any
        state.isFilterUpdated = true
    },
    resetFilerUpdate: state => {
        state.isFilterUpdated = false
    }
}
  })

  