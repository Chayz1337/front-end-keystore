// src/components/explorer/useFilters.ts

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useActions } from "@/src/hooks/user.actions"; // Убедитесь, что это правильный путь к useActions, который использует rootActions
import { useTypedSelector } from "@/src/hooks/useTypedSelector";
import { TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types";
import { initialState as filtersInitialState } from "@/src/store/filters/filters.slice";

export const useFilters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // ===>>> ИСПРАВЛЕНИЕ ЗДЕСЬ <<<===
  // Деструктурируем экшены с их ОРИГИНАЛЬНЫМИ именами из filters.slice
  // (так как rootActions использует ...filtersSlice.actions)
  const { 
    updateQueryParam,    // Оригинальное имя из filters.slice
    resetFilterUpdate,   // Оригинальное имя из filters.slice
    // resetFilters,     // Если нужен, тоже деструктурируем
  } = useActions();
  // dispatchUpdateQueryParam и dispatchResetFilterUpdate больше не нужны как отдельные переменные,
  // если вы просто используете updateQueryParam и resetFilterUpdate напрямую.
  // Если хотите сохранить алиасы для ясности, можно сделать так:
  // const { 
  //   updateQueryParam: dispatchUpdateQueryParam,
  //   resetFilterUpdate: dispatchResetFilterUpdate 
  // } = useActions();
  // Но тогда нужно быть уверенным, что в useActions() есть updateQueryParam и resetFilterUpdate

  const { queryParams, isFilterUpdated } = useTypedSelector(
    state => state.filters
  );

  useEffect(() => {
    // Проверяем, что updateQueryParam определен
    if (updateQueryParam) { // Используем оригинальное имя
      searchParams.forEach((value, key) => {
        if (Object.prototype.hasOwnProperty.call(filtersInitialState.queryParams, key)) {
          updateQueryParam({ // Используем оригинальное имя
            key: key as keyof TypeProductDataFilters,
            value: value,
          });
        }
      });
    }
  }, [searchParams, updateQueryParam, filtersInitialState.queryParams]); // Добавили updateQueryParam в зависимости

  const updateQueryParamsHook = ( // Переименовал, чтобы не конфликтовать с деструктурированным экшеном
    key: keyof TypeProductDataFilters,
    value: string | number | undefined
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value !== undefined && String(value).length > 0) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
    }
    
    replace(pathname + `?${newParams.toString()}`);
    // Проверяем, что updateQueryParam определен
    if (updateQueryParam) { // Используем оригинальное имя
        updateQueryParam({ key, value });
    }
  };

  return {
    queryParams,
    isFilterUpdated,
    updateQueryParams: updateQueryParamsHook, // Возвращаем нашу обертку
    resetFilterUpdate, // Возвращаем напрямую экшен, если он не требует дополнительной логики в хуке
  };
};