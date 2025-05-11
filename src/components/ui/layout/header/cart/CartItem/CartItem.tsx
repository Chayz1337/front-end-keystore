// src/components/ui/layout/header/CartItem/CartItem.tsx
import { FC } from 'react';
import Image from 'next/image';
import styles from './Cart.module.scss';
import { ICartItem } from '@/src/types/cart.inteface';
import { convertPrice } from '@/src/utils/convertPrice';
import CartActions from './CartActions/CartActions';

const CartItem: FC<{ item: ICartItem }> = ({ item }) => {
  return (
    <div
      className={`${styles.item} flex items-start py-3`} // ИЗМЕНЕНО: items-center -> items-start
    >
      {/* 1. Картинка */}
      <div className="flex-shrink-0">
        <Image
          src={item.games.images[0]}
          width={60}
          height={60}
          alt={item.games.name}
          className="rounded object-cover"
          priority
        />
      </div>

      {/* 2. Название и действия (средний блок) */}
      <div className="ml-4 flex-grow flex flex-col min-w-0">
        {/* justify-center был убран, чтобы контент начинался сверху блока */}
        <div
          className={`${styles.name} text-sm text-white mb-1`}
          title={item.games.name}
        >
          {item.games.name}
        </div>
        <CartActions item={item} /> {/* Действия будут под названием */}
      </div>

      {/* 3. Цена */}
      <div className="ml-4 pl-2 text-right whitespace-nowrap font-semibold text-white text-base">
        {/* Цена также выровняется по верхнему краю благодаря items-start у родителя */}
        {convertPrice(item.quantity * item.games.price)}
      </div>
    </div>
  );
};

export default CartItem;