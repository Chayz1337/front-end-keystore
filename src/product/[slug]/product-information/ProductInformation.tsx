import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import { FaGamepad, FaClock, FaDownload } from 'react-icons/fa6';
import { IProduct } from "@/src/types/product.interface";
import { convertPrice } from "@/src/utils/convertPrice";
import FavoriteButton from '@/src/components/ui/catalog/product-item/FavoriteButton';
import AddToCartInline from './AddToCartInline';

interface IProductInformation {
  product: IProduct;
}

export default function ProductInformation({ product }: IProductInformation) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative h-max">
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
        <FaGamepad className="mr-2" />
        Платформа: {'PC'}
      </div>

      {/* Мгновенная доставка */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <FaDownload className="mr-2" />
        Мгновенная доставка
      </div>

      {/* Возврат */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <FaClock className="mr-2" />
        Возврат возможен в течение 14 дней
      </div>

      {/* Кнопка добавить в корзину */}
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
}
