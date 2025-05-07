import { FC } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import ProductRating from "./ProductRating";
import AddToCartButton from "./AddToCartButton";
import { IProduct } from "@/src/types/product.interface";
import { convertPrice } from "@/src/utils/convertPrice";

const DynamicFavoriteButton = dynamic(
  () => import("./FavoriteButton"),
  { ssr: false }
);

const ProductItem: FC<{ games: IProduct; isSorting?: boolean }> = ({
  games,
  isSorting = false,
}) => {
  return (
    <div className={`flex flex-col ${isSorting ? "animate-soft-ping" : ""}`}>
      <div className="bg-white rounded-xl relative mb-2">
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
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          <DynamicFavoriteButton gameId={games.game_id} />
          <AddToCartButton games={games} />
        </div>
      </div>

      <h3 className="mb-1 font-semibold">{games.name}</h3>

      <ProductRating games={games} isText />

      {/* Категории через запятую синего цвета */}
      {games.game_categories?.length ? (
        <div className="text-black text-sm mb-2">
          Категории:{" "}
          {games.game_categories.map(({ category }, i) => (
            <span key={`${category.slug}-${i}`}> {/* Используем slug как уникальный ключ */}
              <a
                href={`/category/${category.slug}`}
                className="text-aqua hover:text-red"
              >
                {category.slug} {/* Отображаем slug категории */}
              </a>
              {i < games.game_categories.length - 1 && ", "}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-blue text-sm mb-2">Без категории</div>
      )}

      <div className="text-xl font-semibold">
        Цена {convertPrice(games.price)}
      </div>
    </div>
  );
};

export default ProductItem;
