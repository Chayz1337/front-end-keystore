import { FC } from "react"
import { useFilters } from "../../useFilters"
import Range from "@/src/components/ui/range/Range"
import FilterWrapper from "../FilterWrapper"

const PriceGroup: FC = () => {
    const {queryParams, updateQueryParams} =useFilters()

    return (<FilterWrapper title='Цена от / до'>
        <Range max = {2000}  fromInitialValue={queryParams.minPrice}
         toInitialValue={queryParams.maxPrice}
          OnChangeFromValue = {(value) => updateQueryParams('minPrice', value)} 
          OnChangeToValue = {(value) => updateQueryParams('maxPrice', value)}
          />
    </FilterWrapper>
    )
}
export default PriceGroup