import ProductRating from "@/src/components/ui/catalog/product-item/ProductRating";
import { IProduct } from "@/src/types/product.interface";
import { Link } from "react-scroll";
import { FiChevronRight } from "react-icons/fi";

interface IProductReviews {
  product: IProduct;
}

export default function ProductReviewsCount({ product }: IProductReviews) {
  const reviewsLength = product.reviews?.length || 0;

  if (!reviewsLength) return null;

  return (
    <div>
      <ProductRating games={product} />
      <div>
        <Link
          className="opacity-50 font-semibold text-sm cursor-pointer"
          to="reviews"
          smooth={true}
          offset={-50}
          duration={1000}
        >
          {reviewsLength} Reviews <FiChevronRight className="inline" />
        </Link>
      </div>
    </div>
  );
}
