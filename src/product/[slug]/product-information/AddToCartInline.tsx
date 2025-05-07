import React, { FC } from 'react';
import { useActions } from '@/src/hooks/user.actions';
import { useCart } from '@/src/hooks/useCart';
import Button from '@/src/components/ui/button/Button';
import { IProduct } from '@/src/types/product.interface';

interface AddToCartInlineProps {
  product: IProduct;
}

const AddToCartInline: FC<AddToCartInlineProps> = ({ product }) => {
  const { addToCart, removeFromCart } = useActions();
  const { items } = useCart();

  // Проверяем, есть ли товар в корзине сейчас
  const currentCartItem = items.find(
    cartItem => cartItem.games.game_id === product.game_id
  );
  const isInCart = Boolean(currentCartItem);

  const handleClick = () => {
    if (isInCart && currentCartItem) {
      // Удаляем из корзины
      removeFromCart({ id: currentCartItem.id });
    } else {
      // Добавляем в корзину, только если есть stock > 0
      if (product.stock > 0) {
        addToCart({
          games: product,
          quantity: 1,
          price: product.price,
          availableStock: product.stock,
        });
      } else {
        alert(`Извините, "${product.name}" временно отсутствует в наличии.`);
      }
    }
  };

  // Блокируем кнопку только когда stock = 0 и товар ещё не в корзине
  const isDisabled = !isInCart && product.stock <= 0;

  // Текст на кнопке:
  const buttonText = isInCart
    ? 'Удалить из корзины'
    : product.stock > 0
      ? 'Добавить в корзину'
      : 'Нет в наличии';

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant="orange"
      className={`mt-1 w-full py-2 px-4 rounded font-semibold
        ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:bg-primary-dark transition-colors'}`}
    >
      {buttonText}
    </Button>
  );
};

export default AddToCartInline;
