// src/components/screens/home/filters/RatingGroup.tsx
import { FC } from "react";
import FilterWrapper from "../FilterWrapper";
import { RATING_VARIANTS } from "@/src/store/filters/filter.types";
import Checkbox from "@/src/components/ui/checkbox/Checkbox";
import { useFilters } from "../../useFilters";

const StarIcon: FC<{ filled: boolean; fillColor: string; emptyColorClass: string; size: number }> = ({
  filled,
  fillColor,
  emptyColorClass,
  size
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    className={`w-${size} h-${size} ${!filled ? emptyColorClass : ''}`}
    style={filled ? { color: fillColor, fill: fillColor } : { fill: 'none' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321l5.572.662c.54.063.758.702.35.995l-4.223 3.801a.563.563 0 00-.162.53l1.231 5.444c.113.501-.423.898-.868.629l-4.939-2.864a.563.563 0 00-.546 0L6.008 21.07c-.445.269-.981-.128-.868-.629l1.231-5.444a.563.563 0 00-.162-.53L2.089 10.59c-.408-.293-.19-.932.35-.995l5.572-.662a.563.563 0 00.475.321L11.48 3.5z"
    />
  </svg>
);

const RatingGroup: FC = () => {
  const { queryParams, updateQueryParams } = useFilters();
  const currentRating = queryParams.rating;

  const starSize = 4;
  const filledStarRgbColor = "rgb(255, 188, 11)";
  const emptyStarTailwindClass = "text-gray-300 dark:text-gray-500";

  const handleRatingChange = (ratingOption: number) => {
    const newRatingValue = String(ratingOption);
    if (String(currentRating) === newRatingValue) {
      updateQueryParams("rating", undefined);
    } else {
      updateQueryParams("rating", newRatingValue);
    }
  };

  const displayRatingVariants = RATING_VARIANTS.slice().reverse();

  return (
    <FilterWrapper title="Игры с рейтингом">
      <div className="space-y-1 mt-2">
        {displayRatingVariants.map(ratingValue => {
          const isChecked = String(currentRating) === String(ratingValue);
          return (
            <Checkbox
              key={ratingValue}
              isChecked={isChecked}
              onClick={() => handleRatingChange(ratingValue)}
              className="mb-1.5 text-sm flex items-center py-0.5"
            >
              <div className="ml-2 flex items-center">
                {[...Array(5)].map((_, index) => {
                  const starDisplayValue = index + 1;
                  const filled = starDisplayValue <= ratingValue;
                  return (
                    <StarIcon
                      key={index}
                      filled={filled}
                      fillColor={filledStarRgbColor}
                      emptyColorClass={emptyStarTailwindClass}
                      size={starSize}
                    />
                  );
                })}
              </div>
            </Checkbox>
          );
        })}
      </div>

    </FilterWrapper>
  );
};

export default RatingGroup;