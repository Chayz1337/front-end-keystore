import { IProduct } from "@/src/types/product.interface";
import { FC, useState } from "react";
import { Rating } from "react-simple-star-rating";


interface IProductRating {
    games: IProduct
    isText?: boolean
}
const ProductRating: FC<IProductRating>  = ({ games, isText = false })=> {
    const reviews = games.reviews || [];

    const averageRating = reviews.length > 0
        ? Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length)
        : 0;

    const [rating] = useState<number>(averageRating);

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
            {isText &&(
            <span>({reviews.length} отзывов)</span>)}
        </div>
    );
};

export default ProductRating;
