// src/components/ui/catalog/product-item/AddToCartButton.tsx

import { useCart } from "@/src/hooks/useCart";
import { useActions } from "@/src/hooks/user.actions";
import { IProduct } from "@/src/types/product.interface";
import { FC, useEffect, useState } from "react";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";
import { ProductService } from "@/src/assets/styles/services/product/product.service";

interface AddToCartButtonProps {
  games: IProduct;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ games }) => {
  const { addToCart, removeFromCart } = useActions();
  const { items } = useCart();

  const currentElement = items.find(
    (cartItem) => cartItem.games.game_id === games.game_id
  );

  // Состояние для актуального числа ключей
  const [availableKeys, setAvailableKeys] = useState<number | null>(null);

  // При монтировании и при смене игры — обновляем
  useEffect(() => {
    let cancelled = false;
    ProductService.getAvailableKeysCount(games.game_id)
      .then((count) => {
        if (!cancelled) setAvailableKeys(count);
      })
      .catch(() => {
        if (!cancelled) setAvailableKeys(0);
      });
    return () => {
      cancelled = true;
    };
  }, [games.game_id]);

  const addAction = () => {
    // если availability ещё не подгрузился, считаем, что можно
    if (availableKeys === null || availableKeys > 0) {
      addToCart({
        games,
        quantity: 1,
        price: games.price,
        availableStock: availableKeys ?? 0,
      });
    } else {
      alert(`Извините, "${games.name}" временно отсутствует в наличии.`);
    }
  };

  return (
    <button
      className="text-primary hover:scale-110 transition-transform"
      onClick={() =>
        currentElement
          ? removeFromCart({ id: currentElement.id })
          : addAction()
      }
      aria-label={
        currentElement
          ? "Удалить из корзины"
          : availableKeys === 0
          ? "Нет в наличии"
          : "Добавить в корзину"
      }
    >
      {currentElement ? <RiShoppingCartFill /> : <RiShoppingCartLine />}
    </button>
  );
};

export default AddToCartButton;
