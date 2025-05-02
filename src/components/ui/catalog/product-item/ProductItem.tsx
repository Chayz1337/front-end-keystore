import { FC } from "react";
import Image from "next/image";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import ProductRating from "./ProductRating";
import { IProduct } from "@/src/types/product.interface";
import dynamic from "next/dynamic";
import { ICategoryGames } from "@/src/types/category.interface";
import { convertPrice } from "@/src/utils/convertPrice";

const DynamicFavoriteButton = dynamic(() => import('./FavoriteButton'), { ssr: false });

const ProductItem: FC<{ games: IProduct; isSorting?: boolean }> = ({ games, isSorting = false }) => {
    // Получаем первый slug категории из массива
    const firstCategorySlug =
        (games.game_categories && games.game_categories[0]?.category?.slug) || 'uncategorized';


    return (
        <div className={`flex flex-col ${isSorting ? 'animate-soft-ping' : ''}`}>
            <div className="bg-while rounded-xl relative mb-2">
                <div className="rounded-xl overflow-hidden h-64 w-full">
                    <a href={`/games/${games.slug}`}>
                        <Image
                            src={games.images[0]}
                            alt={games.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover block mx-auto"
                        />
                    </a>
                </div>
                <div className="absolute top-2 right-2 z-10">
                    <DynamicFavoriteButton gameId={games.game_id} />
                    <AddToCartButton games={games} />
                </div>
            </div>
            <h3 className="mb-1 font-semibold">{games.name}</h3>
            <a href={`/category/${firstCategorySlug}`} className="text-aqua text-sm mb-2">
                {games.game_categories && games.game_categories.length > 0
                    ? `Категория: ${games.game_categories[0].category.slug}`  // Используем slug вместо category_name
                    : 'Без категории'}
            </a>
            <ProductRating games={games} isText />
            <div className="text-xl font-semibold">Цена {convertPrice(games.price)}</div>
        </div>
    );
};

export default ProductItem;
