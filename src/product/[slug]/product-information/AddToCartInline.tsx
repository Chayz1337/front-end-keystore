// src/product/[slug]/product-information/AddToCartInline.tsx
import React, { FC } from 'react';
// Импорты хуков и типов
import { useActions } from '@/src/hooks/user.actions';
import { useCart } from '@/src/hooks/useCart'; // <<< Добавляем useCart

// Импорт компонента Button, который ты используешь
import Button from '@/src/components/ui/button/Button'; // <<< Убедись, что путь верный
import { Game } from '@/src/types/game-key.interface';

// Интерфейс пропсов остается прежним
interface AddToCartInlineProps {
    product: Game; // или IProduct
    availableKeys: number | null;
}

const AddToCartInline: FC<AddToCartInlineProps> = ({ product, availableKeys }) => {
  // Достаем actions: addToCart и removeFromCart
  const { addToCart, removeFromCart } = useActions();
  // Достаем items из корзины для проверки
  const { items } = useCart();

  // Проверяем, есть ли ТЕКУЩИЙ товар (product) уже в корзине
  const currentElementInCart = items.find(
      cartItem => cartItem.games.game_id === product?.game_id // Добавим ?. для безопасности
  );
  const isInCart = !!currentElementInCart; // Преобразуем в boolean: true если в корзине, false если нет

  // --- Общий обработчик клика ---
  const handleToggleCart = () => {
    // Если товар УЖЕ в корзине
    if (isInCart && currentElementInCart) {
        removeFromCart({ id: currentElementInCart.id });
    }
    // Если товара НЕТ в корзине
    else if (!isInCart) {
        // Проверяем доступность перед добавлением
        if (product && typeof availableKeys === 'number' && availableKeys > 0) {
            addToCart({
                games: product,
                quantity: 1,
                price: product.price,
                availableStock: availableKeys
            });
        } else {
            // Ничего не делаем, кнопка должна быть disabled в этом случае
            console.warn(`[AddToCartInline] Попытка добавить недоступный товар ${product?.name}`);
        }
    }
  };

  // --- Определяем состояние disabled ---
  // Кнопка должна быть заблокирована ТОЛЬКО если мы пытаемся ДОБАВИТЬ
  // товар, которого нет в наличии (или неизвестно).
  // Если товар уже в корзине (isInCart = true), кнопка УДАЛЕНИЯ должна быть активна.
  const isDisabled = !isInCart && (!product || typeof availableKeys !== 'number' || availableKeys <= 0);

  // --- Определяем текст кнопки ---
  let buttonText: string;
  if (isInCart) {
      buttonText = 'Удалить из корзины';
  } else {
      if (availableKeys === null) {
          buttonText = 'Проверка наличия...';
      } else if (typeof availableKeys === 'number' && availableKeys > 0) {
          buttonText = 'Добавить в корзину';
      } else {
          buttonText = 'Нет в наличии';
      }
  }

  return (
    <Button
      onClick={handleToggleCart} // Вызывает универсальный обработчик
      disabled={isDisabled}     // Блокируем только при попытке ДОБАВИТЬ недоступный товар
      variant='orange'
       className={`mt-1 w-full py-2 px-4 rounded font-semibold ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:bg-primary-dark transition-colors'}`} // твои классы из прошлого примера, если они лучше
    >
       {buttonText}
    </Button>
  );
};

export default AddToCartInline;
