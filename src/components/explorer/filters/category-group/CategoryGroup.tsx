import { FC } from "react"
import { useFilters } from "../../useFilters"
import FilterWrapper from "../FilterWrapper"
import Checkbox from "@/src/components/ui/checkbox/Checkbox"
import { useCategories, ICategory } from "@/src/hooks/useCategories"
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
    <FilterWrapper title="Category">
      {data.map(category => {
  const isChecked = queryParams.categoryId === category.slug

  return (
    <Checkbox
      key={category.slug}
      isChecked={isChecked}
      onClick={() =>
        updateQueryParams(
          "categoryId",
          isChecked ? "" : category.slug
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
