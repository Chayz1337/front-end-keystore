import ProductRating from "@/src/components/ui/catalog/product-item/ProductRating";
import { IProduct } from "@/src/types/product.interface";
import { Link } from "react-scroll";
import { FiChevronRight } from "react-icons/fi";

interface IProductReviews {
  product: IProduct;
}

export default function ProductReviewsCount({ product }: IProductReviews) {
  const reviewsLength = product.reviews?.length || 0;

  // Функция для склонения слова "отзыв"
  function getReviewWord(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'отзывов'; // исключения для 11-14
    }

    switch (lastDigit) {
      case 1:
        return 'отзыв';
      case 2:
      case 3:
      case 4:
        return 'отзыва';
      default:
        return 'отзывов';
    }
  }

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
          {reviewsLength} {getReviewWord(reviewsLength)} <FiChevronRight className="inline" />
        </Link>
      </div>
    </div>
  );
}
