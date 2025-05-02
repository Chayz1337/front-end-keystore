import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import { IProduct } from "@/src/types/product.interface"; // Замените на правильный путь импорта
import { convertPrice } from "@/src/utils/convertPrice"; // Замените на правильный путь импорта
import FavoriteButton from '@/src/components/ui/catalog/product-item/FavoriteButton';
import AddToCartInline from './AddToCartInline';

// Интерфейс для данных о продукте
interface IProductInformation {
  product: IProduct;
}

// Компонент ProductInformation
export default function ProductInformation({ product }: IProductInformation) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative h-max">
      {/* Отображение цены */}
      <div className="text-3xl font-semibold">
        {convertPrice(product.price)}
      </div>

      {/* Секцию с информацией о доставке */}
      <div className="mt-2">
        $6.88 Shipping{' '}
        <Link href="/" className="text-aqua font-semibold ml-2">
          Details
        </Link>
      </div>
      
      {/* Примечание о налогах */}
      <span className="opacity-50 mt-1 text-sm block">
        Sales taxes may apply at checkout
      </span>

      {/* Секцию с датой доставки */}
      <div className="mt-4 text-sm">
        <span className="opacity-50 mr-1">Delivery</span> Thursday, June 10
      </div>

      {/* Кнопка добавления в корзину */}
      <AddToCartInline product={product} />

      {/* Информация о безопасности транзакции */}
      <p className="flex items-center mt-2 opacity-40 text-sm">
        <FaLock className="mr-2" /> Secure transaction
      </p>

      {/* Кнопка избранного */}
      <div className="absolute top-6 right-6">
        <FavoriteButton gameId={product.game_id} />
      </div>
    </div>
  );
}
