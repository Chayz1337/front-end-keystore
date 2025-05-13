import React from 'react';
import { IProduct } from "@/src/types/product.interface";
import { convertPrice } from "@/src/utils/convertPrice";
import { FaClock, FaDownload, FaGamepad, FaKey, FaLock } from "react-icons/fa";
import AddToCartInline from "./AddToCartInline";
import FavoriteButton from "@/src/components/ui/catalog/product-item/FavoriteButton";

interface IProductInformation {
  product: IProduct;
}

const ProductInformation: React.FC<IProductInformation> = ({ product }) => {
  return (
    <div className="bg-while rounded-lg shadow-md p-6 relative h-max">
      {/* Цена */}
      <div className="text-3xl font-semibold mb-2">
        {convertPrice(product.price)}
      </div>

      {/* Тип издания */}
      <div className="text-sm text-gray-700 mb-2">
        Издание: <span className="font-medium text-gray-800">Стандартное</span>
      </div>

      {/* Платформа */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <FaGamepad className="mr-2 text-primary" />
        Платформа: PC, Steam
      </div>

      {/* Мгновенная доставка */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <FaDownload className="mr-2 text-primary" />
        Мгновенная доставка
      </div>

      {/* Возврат */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <FaClock className="mr-2 text-primary" />
        Возврат возможен в течение 14 дней
      </div>

      {/* Наличие по полю stock */}
            <div className="mb-4">
        {product.stock > 0 ? (
          // Если есть в наличии
          <p className="text-lg font-medium text-green-600 dark:text-green-600 flex items-center"> {/* Используем зеленый цвет */}
            <FaKey className="mr-2 text-primary" /> {/* Иконка ключа */}
            В наличии {/* Текст изменен */}
          </p>
        ) : (
          // Если нет в наличии
          <p className="text-lg font-medium text-red-600 dark:text-red-400 flex items-center"> {/* Красный цвет, убрал flex и иконку ключа */}
          <FaKey className="mr-2 text-primary" />
            Нет доступных ключей
          </p>
        )}
      </div>
      {/* Кнопка добавления/удаления */}
      <AddToCartInline product={product} />

      {/* Безопасная транзакция */}
      <p className="flex items-center mt-3 opacity-40 text-sm">
        <FaLock className="mr-2" /> Безопасная оплата и доставка цифрового ключа
      </p>

      {/* Избранное */}
      <div className="absolute top-6 right-6">
        <FavoriteButton gameId={product.game_id} />
      </div>
    </div>
  );
};

export default ProductInformation;
