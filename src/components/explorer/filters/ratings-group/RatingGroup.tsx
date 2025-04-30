// RatingGroup.tsx
import { FC } from "react"
import { useFilters } from "../../useFilters"
import FilterWrapper from "../FilterWrapper"
import Checkbox from "@/src/components/ui/checkbox/Checkbox"
import { RATING_VARIANTS } from "./rating-variants.data"
import { updateRatingsQuery } from "./update-rarings-query"
import { Rating } from "react-simple-star-rating"

const RatingGroup: FC = () => {
  const { queryParams, updateQueryParams } = useFilters()
  const currentRatings = queryParams.ratings ?? ""

  return (
    <FilterWrapper title="Number of reviews">
      {RATING_VARIANTS.map(rating => {
        const ratingStr = rating.toString()
        const isChecked = currentRatings.includes(ratingStr)

        return (
          <Checkbox
            key={rating}
            isChecked={isChecked}
            onClick={() =>
              updateQueryParams(
                "ratings",
                updateRatingsQuery(currentRatings, ratingStr)
              )
            }
            className="mb-2 text-sm"
          >
            <Rating
              readonly
              initialValue={rating}
              SVGstyle={{ display: "inline-block" }}
              size={20}
              transition
            />
          </Checkbox>
        )
      })}
    </FilterWrapper>
  )
}

export default RatingGroup
