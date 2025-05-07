import { useCart } from "@/src/hooks/useCart";
import { useActions } from "@/src/hooks/user.actions";
import { IProduct } from "@/src/types/product.interface";
import { FC } from "react";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";

interface AddToCartButtonProps {
  games: IProduct;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ games }) => {
  const { addToCart, removeFromCart } = useActions();
  const { items } = useCart();

  // Ищем, есть ли уже этот товар в корзине
  const currentElement = items.find(
    (cartItem) => cartItem.games.game_id === games.game_id
  );

  // Общее количество товара в корзине
  const currentQuantity = currentElement ? currentElement.quantity : 0;

  const handleClick = () => {
    if (currentElement) {
      // Если уже в корзине — удаляем
      removeFromCart({ id: currentElement.id });
    } else {
      // Если не в корзине — добавляем, но только если stock > 0
      const availableStock = games.stock - currentQuantity; // оставшийся доступный сток

      if (availableStock > 0) {
        addToCart({
          games,
          quantity: 1,
          price: games.price,
          availableStock: availableStock, // Передаем правильный доступный stock
        });
      } else {
        alert(`Извините, "${games.name}" временно отсутствует в наличии.`);
      }
    }
  };

  // aria-label и иконка меняются в зависимости от состояния
  const ariaLabel = currentElement
    ? "Удалить из корзины"
    : games.stock > 0
      ? "Добавить в корзину"
      : "Нет в наличии";

  return (
    <button
      className="text-primary hover:scale-110 transition-transform"
      onClick={handleClick}
      disabled={games.stock <= 0 && !currentElement}
      aria-label={ariaLabel}
    >
      {currentElement ? <RiShoppingCartFill /> : <RiShoppingCartLine />}
    </button>
  );
};

export default AddToCartButton;
