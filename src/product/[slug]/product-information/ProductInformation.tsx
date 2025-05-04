import React from 'react'; // Импортируем React, если используем FC
// Убедись, что импортируешь правильный тип, содержащий нужные поля (game_id, price)
// Можно использовать Game или IProduct, если IProduct включает нужные поля.
// Важно, чтобы ТИП Product соответствовал данным, которые реально приходят.
import { IProduct } from "@/src/types/product.interface"; // Оставим IProduct, если ты его используешь
// import { Game } from "@/src/types/game.interface";
import { convertPrice } from "@/src/utils/convertPrice";
import { FaClock, FaDownload, FaGamepad, FaLock } from "react-icons/fa";
import AddToCartInline from "./AddToCartInline";
import FavoriteButton from "@/src/components/ui/catalog/product-item/FavoriteButton";

interface IProductInformation {
  product: IProduct; // Или Game, если используешь его напрямую
  availableKeys: number | null;  // Это поле мы получаем как проп
}

const ProductInformation: React.FC<IProductInformation> = ({ product, availableKeys }) => {
  // Небольшая отладка, чтобы видеть приходящие пропсы
  console.log("[ProductInformation] Received product:", product);
  console.log("[ProductInformation] Received availableKeys:", availableKeys);

  return (
    <div className="bg-while rounded-lg shadow-md p-6 relative h-max">
      {/* Проверяем наличие product перед доступом к его полям */}
      {product ? (
        <>
          {/* Цена */}
          <div className="text-3xl font-semibold mb-2">
            {convertPrice(product.price)}
          </div>

          {/* Тип издания */}
          <div className="text-sm text-gray-500 mb-2">
            Издание: <span className="font-medium text-gray-800">Стандартное</span>
          </div>

          {/* Платформа */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaGamepad className="mr-2 text-primary" />
            Платформа: {'PC'} {/* Замени на product.platform если поле есть */}
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

          {/* Информация о наличии ключей (из пропса availableKeys) */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            {availableKeys === null ? (
              <p className="text-lg text-gray-500">Загрузка наличия ключей…</p>
            ) : availableKeys > 0 ? (
              <p className="text-lg font-medium text-gray-800">
                В наличии ключей: {availableKeys}
              </p>
            ) : (
              <p className="text-lg font-medium text-red-600">
                Нет доступных ключей
              </p>
            )}
          </div>

          {/* --- КНОПКА ДОБАВИТЬ В КОРЗИНУ --- */}
          {/* --->>> ВОТ ИЗМЕНЕНИЕ: Передаем availableKeys <<<--- */}
          <AddToCartInline product={product} availableKeys={availableKeys} />

          {/* Безопасная транзакция */}
          <p className="flex items-center mt-3 opacity-40 text-sm">
            <FaLock className="mr-2" /> Безопасная оплата и доставка цифрового ключа
          </p>

          {/* Избранное */}
          <div className="absolute top-6 right-6">
            <FavoriteButton gameId={product.game_id} />
          </div>
        </>
      ) : (
        // Отображаем что-то, если product еще не загружен
        <div className="text-center p-10">Загрузка информации о продукте...</div>
      )}
    </div>
  );
};

export default ProductInformation;