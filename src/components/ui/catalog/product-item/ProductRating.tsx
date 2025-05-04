import { IProduct } from "@/src/types/product.interface";
import { FC, useState } from "react";
import { Rating } from "react-simple-star-rating";

interface IProductRating {
  games: IProduct;
  isText?: boolean;
}

const ProductRating: FC<IProductRating> = ({ games, isText = false }) => {
  const reviews = games.reviews || [];

  const averageRating =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        )
      : 0;

  const [rating] = useState<number>(averageRating);

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

  return (
    <div className="mb-2">
      <span className="mr-1">Рейтинг:</span>
      <Rating
        readonly
        initialValue={rating}
        SVGstyle={{ display: "inline-block" }}
        size={20}
        allowFraction
        transition
      />
      {isText && (
        <span>
          ({reviews.length} {getReviewWord(reviews.length)})
        </span>
      )}
    </div>
  );
};

export default ProductRating;
