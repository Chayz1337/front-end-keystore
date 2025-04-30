import { FC } from 'react';
import Image from 'next/image';
import styles from './Cart.module.scss'
import { ICartItem } from '@/src/types/cart.inteface';
import { convertPrice } from '@/src/utils/convertPrice';
import CartActions from './CartActions/CartActions';

const CartItem: FC<{ item: ICartItem }> = ({ item }) => {
    console.log(item.games);
  return (
    <div className={styles.item}>
      <Image
        src={item.games.images[0]}
        width={100}
        height={100}
        alt={item.games.name}
        
      />
      <div>
        <div className={styles.name}>{item.games.name}</div>
        <div className={styles.price}>{convertPrice(item.games.price)}</div>
        <CartActions item={item} />
      </div>
    </div>
  );
};

export default CartItem;
