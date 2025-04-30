import { FC } from "react"
import CategoryGroup from "./category-group/CategoryGroup"
import RatingGroup from "./ratings-group/RatingGroup"
import PriceGroup from "./price-group/PriceGroup"

const Filters: FC = () => {
    return (
    <div>
    <PriceGroup />
    <CategoryGroup  />
    <RatingGroup />
    </div>
    )
}
    export default Filters