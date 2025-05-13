// src/components/explorer/useFilters.ts (или ваш актуальный путь)

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useActions } from "@/src/hooks/user.actions";
import { useTypedSelector } from "@/src/hooks/useTypedSelector";
import { TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types";

// ===== ВОТ ЭТОТ ИМПОРТ НУЖНО ДОБАВИТЬ ИЛИ РАСКОММЕНТИРОВАТЬ =====
import { initialState as filtersInitialState } from "@/src/store/filters/filters.slice"; // <-- УКАЖИТЕ ПРАВИЛЬНЫЙ ПУТЬ К ВАШЕМУ filtersSlice.ts

export const useFilters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const { updateQueryParam: dispatchUpdateQueryParam, resetFilterUpdate: dispatchResetFilterUpdate } = useActions();

  const { queryParams, isFilterUpdated } = useTypedSelector(
    state => state.filters
  );

  useEffect(() => {
    searchParams.forEach((value, key) => {
      // Теперь filtersInitialState будет определен благодаря импорту выше
      if (Object.prototype.hasOwnProperty.call(filtersInitialState.queryParams, key)) {
        dispatchUpdateQueryParam({
          key: key as keyof TypeProductDataFilters,
          value: value,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQueryParams = (
    key: keyof TypeProductDataFilters,
    value: string | number | undefined
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value !== undefined && String(value).length > 0) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
      if (key === 'page' && newParams.get('page') === '') {
        newParams.delete(key);
      }
    }
    
    replace(pathname + `?${newParams.toString()}`);
    dispatchUpdateQueryParam({ key, value });
  };

  return {
    queryParams,
    isFilterUpdated,
    updateQueryParams,
    resetFilterUpdate: dispatchResetFilterUpdate,
  };
};