// src/components/explorer/filters/price-group/PriceGroup.tsx
import { FC } from "react";
import { useFilters } from "../../useFilters";
import Range from "@/src/components/ui/range/Range";
import FilterWrapper from "../FilterWrapper";

const PriceGroup: FC = () => {
    const { queryParams, updateQueryParams } = useFilters();

    // Создаем ключ, который будет меняться, когда minPrice и maxPrice сбрасываются.
    // Когда они оба undefined (после сброса), ключ будет, например, "reset".
    // Когда они имеют значения, ключ будет другим.
    // Это заставит Range перемонтироваться при сбросе.
    const rangeKey = (queryParams.minPrice === undefined && queryParams.maxPrice === undefined) 
                     ? "range-reset" 
                     : `range-${queryParams.minPrice}-${queryParams.maxPrice}`;

    // console.log("PriceGroup RENDER, rangeKey:", rangeKey, "minPrice:", queryParams.minPrice, "maxPrice:", queryParams.maxPrice);

    return (
      <FilterWrapper title='Цена от / до'>
        <Range 
          key={rangeKey} // <--- ДОБАВЛЯЕМ KEY
          max={20000} 
          fromInitialValue={queryParams.minPrice}
          toInitialValue={queryParams.maxPrice}
          OnChangeFromValue={(value: string) => updateQueryParams('minPrice', value)} 
          OnChangeToValue={(value: string) => updateQueryParams('maxPrice', value)}
        />
      </FilterWrapper>
    );
}
export default PriceGroup;