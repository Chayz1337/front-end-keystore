// AddToCartButton.tsx
import { useCart } from "@/src/hooks/useCart";
import { useActions } from "@/src/hooks/user.actions";
import { IProduct } from "@/src/types/product.interface";
import { FC } from "react";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";
import { useAuth } from "@/src/hooks/useAuth";

interface AddToCartButtonProps {
  games: IProduct;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ games }) => {
  const { user } = useAuth();
  const { addToCart, removeFromCart } = useActions();
  const { items } = useCart();

  if (!user) return null;

  const currentElementInCart = items.find(
    (cartItem) => cartItem.games.game_id === games.game_id
  );

  const isInCart = !!currentElementInCart;
  const isOutOfStock = games.stock <= 0;

  const handleClick = () => {
    if (isInCart) {
      removeFromCart({ id: currentElementInCart.id });
    } else {
      if (!isOutOfStock) {
        addToCart({
          games,
          quantity: 1,
          price: games.price,
          availableStock: games.stock,
        });
      } else {
        alert(`Извините, "${games.name}" временно отсутствует в наличии.`);
      }
    }
  };

  let iconColorClass = 'text-gray-600 hover:text-primary'; // Темно-серый по умолчанию, оранжевый при наведении
  let titleText = "Добавить в корзину";

  if (isInCart) {
    iconColorClass = 'text-primary hover:text-primary'; // Оранжевый, если в корзине
    titleText = "Удалить из корзины";
  } else if (isOutOfStock) {
    iconColorClass = 'text-gray-500 cursor-not-allowed'; // Светло-серый, если нет в наличии
    titleText = "Нет в наличии";
  }

  return (
    <button
      className={`transition-all duration-200 ease-in-out hover:scale-110 focus-visible:outline-none transform active:scale-100 ${iconColorClass}`}
      onClick={handleClick}
      disabled={isOutOfStock && !isInCart}
      aria-label={titleText}
      title={titleText}
    >
      {isInCart ? <RiShoppingCartFill size={20} /> : <RiShoppingCartLine size={20} />}
    </button>
  );
};

export default AddToCartButton;