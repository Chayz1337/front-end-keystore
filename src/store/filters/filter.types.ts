// src/store/filters/filter.types.ts
 // Убедитесь, что путь правильный

import { TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types";

export interface IFiltersState {
  isFilterUpdated: boolean;
  queryParams: TypeProductDataFilters;
}

export interface IFiltersActionsPayload {
  key: keyof TypeProductDataFilters;
  value: string | number | undefined; // <--- ИЗМЕНИТЬ ЗДЕСЬ!
}

export const RATING_VARIANTS = [1, 2, 3, 4, 5];