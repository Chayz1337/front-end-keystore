import { FC } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import ProductRating from "./ProductRating";
import AddToCartButton from "./AddToCartButton";
import { IProduct } from "@/src/types/product.interface";
import { convertPrice } from "@/src/utils/convertPrice";
import { useAuth } from "@/src/hooks/useAuth";

const DynamicFavoriteButton = dynamic(
  () => import("./FavoriteButton"),
  { ssr: false }
);

const ProductItem: FC<{ games: IProduct; isSorting?: boolean }> = ({
  games,
  isSorting = false,
}) => {
  const { user } = useAuth();

  return (
    <div className={`flex flex-col group`}>
      <div 
        className={`
          bg-while rounded-xl relative mb-2 
          hover:shadow-lg transition-all duration-200 ease-in-out {/* Добавили transition-all сюда */}
          ${isSorting 
            ? "shadow-xl scale-103 -translate-y-1" // Применяем scale, translate и shadow сюда
            : "shadow-md scale-100 translate-y-0"
          }
        `}
      >
        <div 
          className={`
            rounded-xl overflow-hidden h-52 sm:h-64 w-full
            {/* Убрали отсюда transition и условные классы для scale/translate */}
          `}
        >
          <Link href={`/games/${games.slug}`} passHref legacyBehavior>
            <a className="block w-full h-full">
              <Image
                src={games.images && games.images.length > 0 ? games.images[0] : "/placeholder-image.png"}
                alt={games.name}
                width={500}
                height={500}
                className="w-full h-full object-cover block mx-auto group-hover:scale-105 transition-transform duration-300 ease-in-out"
                priority={!isSorting}
              />
            </a>
          </Link>
        </div>

        {user && (
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-2">
            <div className="bg-while/60 hover:bg-while/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-150">
              <DynamicFavoriteButton gameId={games.game_id} />
            </div>
            <div className="bg-while/60 hover:bg-while/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-150">
              <AddToCartButton games={games} />
            </div>
          </div>
        )}
      </div>

      <Link href={`/games/${games.slug}`} passHref legacyBehavior>
        <a className="mb-1 font-semibold text-base md:text-lg text-gray-800 transition-colors line-clamp-2" title={games.name}>
            {games.name}
        </a>
      </Link>
      
      <ProductRating games={games} isText />

      {games.game_categories && games.game_categories.length > 0 ? (
        <div className="text-xs sm:text-sm text-black mb-2 mt-1 flex items-center flex-wrap">
          <span className="mr-1 text-gray-600">Категории:</span>
          {games.game_categories.slice(0, 3).map(({ category }, i, arr) => (
            <span key={`${category.slug}-${i}`} className="inline-block">
              <Link href={`/category/${category.slug}`} passHref legacyBehavior>
                <a className="text-aqua hover:text-red-500 transition-colors">
                  {category.category_name}
                </a>
              </Link>
              {i < arr.length - 1 && (
                <span className="text-gray-500 mx-0.5">,</span>
              )}
            </span>
          ))}
          {games.game_categories.length > 3 && (
             <Link href={`/games/${games.slug}`} passHref legacyBehavior>
                <a className="text-gray-500 hover:text-red hover:underline transition-colors ml-1">...</a>
            </Link>
          )}
        </div>
      ) : ( 
        <div className="text-gray-400 text-xs sm:text-sm mb-2 mt-1 h-[20px] sm:h-[22px]">
        </div> 
      )}

      <div className="text-lg md:text-xl font-bold text-gray-900 mt-auto pt-1">
        Цена: {convertPrice(games.price)}
      </div>
    </div>
  );
};

export default ProductItem;