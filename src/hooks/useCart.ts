import { useTypedSelector } from "./useTypedSelector";

// Хук для работы с корзиной
export const useCart = () => {
  // Получаем элементы корзины из глобального состояния
  const items = useTypedSelector(state => state.cart.items);

  // Вычисляем общую сумму всех товаров в корзине
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity, 
    0 // Начальное значение для аккумулятора
  );

  // Возвращаем элементы корзины и общую сумму
  return { items, total };
}
