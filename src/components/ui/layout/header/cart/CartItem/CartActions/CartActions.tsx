// src/components/screens/cart/cart-item/CartActions/CartActions.tsx
import React, { FC } from 'react';
import { FiMinus, FiPlus, FiTrash } from 'react-icons/fi';
import { useActions } from '@/src/hooks/user.actions';
import { useCart } from '@/src/hooks/useCart';
import { ICartItem } from '@/src/types/cart.inteface'; // Теперь содержит availableStock

const CartActions: FC<{ item: ICartItem }> = ({ item }) => {
  const { removeFromCart, changeQuantity } = useActions();
  const { items } = useCart(); // Для получения актуального quantity

  const currentItemState = items.find(cartItem => cartItem.id === item.id);
  const quantity = currentItemState ? currentItemState.quantity : item.quantity;

  // ===>>> ПОЛУЧАЕМ ЛИМИТ ИЗ СОХРАНЕННОГО ПОЛЯ <<<===
  const limit = item.availableStock;

  // ===>>> ОБРАБОТЧИК КНОПКИ "+", КОТОРЫЙ ТЫ ХОЧЕШЬ <<<===
  const handleIncrease = () => {
    console.log(`[CartActions] + Нажато. Кол-во: ${quantity}, Лимит: ${limit} (Тип: ${typeof limit})`);

    // Шаг 1: Проверяем, является ли лимит корректным числом
    if (typeof limit !== 'number' || limit < 0) {
        console.warn(`[CartActions] Лимит невалиден (${limit}). Увеличение запрещено.`);
        // Можно показать временное сообщение пользователю, но alert здесь может быть навязчивым
        // alert("Не удалось проверить наличие. Попробуйте обновить корзину.");
        return; // Прерываем выполнение, не даем увеличить
    }

    // Шаг 2: Сравниваем текущее количество с лимитом
    if (quantity >= limit) {
        // Если количество УЖЕ равно или больше лимита - показываем ошибку
        console.log("[CartActions] Лимит достигнут!");
        alert(`Больше добавить нельзя. Доступно только ${limit} шт.`);
    } else {
        // Если количество МЕНЬШЕ лимита - разрешаем увеличение
        console.log("[CartActions] Увеличиваем количество...");
        changeQuantity({ id: item.id, type: 'plus' });
    }
  };

  // Обработчик кнопки "-" (без изменений, проверяет только quantity > 1)
  const handleDecrease = () => {
     if (quantity > 1) {
         changeQuantity({ id: item.id, type: 'minus' });
     }
  }

  // Обработчик удаления (без изменений)
  const handleRemove = () => {
    console.log('--- [CartActions] Удаление элемента ---', item.id); // Лог можно оставить для отладки
    // Сразу вызываем удаление без вопроса
    removeFromCart({ id: item.id });
}

  // Определяем, неактивна ли кнопка ПЛЮС (для disabled)
  const isPlusDisabled = typeof limit !== 'number' || quantity >= limit;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        {/* Минус */}
        <button onClick={handleDecrease} disabled={quantity <= 1} aria-label="Уменьшить" className="p-1 disabled:opacity-50">
            <FiMinus/>
        </button>

        {/* Количество */}
        <span className="w-10 text-center">{quantity}</span>

        {/* ===>>> ПЛЮС <<<=== */}
        <button
          onClick={handleIncrease} // Вызывает ТОЛЬКО НАШ обработчик с проверкой
          disabled={isPlusDisabled} // Делаем неактивной, если лимит достигнут или неизвестен
          aria-label="Увеличить"
          className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <FiPlus/>
        </button>

        {/* Удалить */}
        <button onClick={handleRemove} aria-label="Удалить" className="ml-3 text-gray-500 hover:text-red-500">
            <FiTrash/>
        </button>
      </div>

       {/* Опционально: Показываем сообщение о лимите под кнопками */}
      { isPlusDisabled && typeof limit === 'number' && limit > 0 && quantity >= limit &&
          <div className="text-red-500 text-xs mt-1">Максимум: {limit} шт.</div>
      }
      {/* Можно добавить сообщение, если лимит вообще не пришел */}
      {/* { typeof limit !== 'number' && <div className="text-yellow-500 text-xs mt-1">Наличие не определено</div>} */}

    </div>
  );
};

export default CartActions;