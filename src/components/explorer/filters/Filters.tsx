// src/components/screens/home/filters/Filters.tsx
import { FC } from "react";
import CategoryGroup from "./category-group/CategoryGroup";
import RatingGroup from "./ratings-group/RatingGroup";
import PriceGroup from "./price-group/PriceGroup";
import { useActions } from "@/src/hooks/user.actions";
import { usePathname, useRouter } // Убрали useSearchParams, если он больше не нужен для других целей
from 'next/navigation';
import { TypeProductDataFilters } from "@/src/assets/styles/services/product/product.types";
import { useTypedSelector } from "@/src/hooks/useTypedSelector"; // Импортируем для доступа к queryParams

const Filters: FC = () => {
  const { resetFilters: dispatchResetFilters } = useActions();
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams(); // Больше не нужен здесь, если только для hasActiveFilters

  // Получаем queryParams из Redux store
  const queryParams = useTypedSelector(state => state.filters.queryParams);

  const handleResetAllFilters = () => {
    dispatchResetFilters();
    router.push(pathname); 
  };

  // Функция для проверки, есть ли активные фильтры, ТЕПЕРЬ НА ОСНОВЕ REDUX STATE
  const hasActiveFilters = () => {
    // Проверяем, есть ли хотя бы один фильтр (кроме page, sort, perPage)
    // со значением, отличным от undefined или пустой строки.
    if (
      queryParams.category_id || // undefined или число
      queryParams.rating ||      // undefined или число
      queryParams.minPrice ||    // undefined или строка
      queryParams.maxPrice ||    // undefined или строка
      queryParams.searchTerm     // undefined или строка
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="py-4 px-2 md:px-0">
      {hasActiveFilters() && ( // Теперь эта функция использует queryParams из Redux
        <div className="mb-6">
          <button
            onClick={handleResetAllFilters}
            type="button"
            className="w-52 px-3 py-2 border border-red-500 
                       rounded-md shadow-sm text-sm font-medium 
                       text-while  
                       bg-red-500
                       hover:bg-red-600 /* Улучшенный hover для красной кнопки */
                       dark:hover:bg-red-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 
                       transition-colors duration-150"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

      <PriceGroup />
      <CategoryGroup />
      <RatingGroup />
    </div>
  );
};

export default Filters;