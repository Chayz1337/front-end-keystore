import React, { FC } from 'react';
import { useActions } from '@/src/hooks/user.actions';
import { useCart } from '@/src/hooks/useCart';
import Button from '@/src/components/ui/button/Button';
import { IProduct } from '@/src/types/product.interface';
import { useAuth } from '@/src/hooks/useAuth';

interface AddToCartInlineProps {
  product: IProduct;
}

const AddToCartInline: FC<AddToCartInlineProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, removeFromCart } = useActions();
  const { items } = useCart();

  if (!user) {
    return (
      <div className="flex justify-center">
        <Button
          disabled
          variant="orange"
          className="w-69 py-4 px-4 text-base rounded font-medium opacity-50 cursor-not-allowed bg-gray-400"
        >
          Войдите, чтобы добавить в корзину
        </Button>
      </div>
    );
  }

  const currentCartItem = items.find(
    cartItem => cartItem.games.game_id === product.game_id
  );
  const isInCart = Boolean(currentCartItem);

  const handleClick = () => {
    if (isInCart && currentCartItem) {
      removeFromCart({ id: currentCartItem.id });
    } else {
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

  const isDisabled = !isInCart && product.stock <= 0;

  const buttonText = isInCart
    ? 'Удалить из корзины'
    : product.stock > 0
    ? 'Добавить в корзину'
    : 'Нет в наличии';

  return (
    <div className="flex justify-center">
<Button
  onClick={handleClick}
  disabled={isDisabled}
  variant="orange"
  className={`w-64 py-3 px-6 text-base rounded font-medium
    ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:bg-primary-dark transition-colors'}`}
>
  {buttonText}
</Button>
    </div>
  );
};

export default AddToCartInline;
