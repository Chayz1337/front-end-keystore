import { FC } from "react"
import { useFilters } from "../../useFilters"
import FilterWrapper from "../FilterWrapper"
import Checkbox from "@/src/components/ui/checkbox/Checkbox"
import { useCategories } from "@/src/hooks/useCategories"
import Loader from "@/src/components/ui/Loader"

const CategoryGroup: FC = () => {
  const { queryParams, updateQueryParams } = useFilters()
  const { data, isLoading, error } = useCategories()

  if (isLoading) {
    return (
      <FilterWrapper title="Category">
        <Loader />
      </FilterWrapper>
    )
  }

  if (error || !data?.length) {
    return (
      <FilterWrapper title="Category">
        <div>No categories found</div>
      </FilterWrapper>
    )
  }

  return (
    <FilterWrapper title="Категории">
      {data.map(category => {
        // приводим оба к строке, чтобы сравнение прошло без ошибок типов
        const isChecked =
          String(queryParams.category_id) === String(category.category_id)

        return (
          <Checkbox
            key={category.category_id}
            isChecked={isChecked}
            onClick={() =>
              updateQueryParams(
                "category_id",
                isChecked
                  ? "" // сброс
                  : String(category.category_id) // в URL всегда строка
              )
            }
            className="mb-2 text-sm"
          >
            {category.category_name}
          </Checkbox>
        )
      })}
    </FilterWrapper>
  )
}

export default CategoryGroup
