import { FC } from 'react';
import { useCart } from "@/src/hooks/useCart"; // Убедитесь, что путь к хука правильный
import { IProduct } from "@/src/types/product.interface"; // Импорт типа IProduct
import Button from '@/src/components/ui/button/Button';
import { useActions } from '@/src/hooks/user.actions';
import { ICartItem } from '@/src/types/cart.inteface';
 // Добавьте этот импорт

const AddToCartInline: FC<{ product: IProduct }> = ({ product }) => {
  const { addToCart, removeFromCart } = useActions(); // Действия для добавления и удаления из корзины
  const { items } = useCart(); // Получаем текущие товары в корзине

  // Находим товар в корзине по game_id
  const currentElement = items.find(cartItem => cartItem.games.game_id === product.game_id);

  // Функция для обработки кликов (добавление или удаление товара)
  const handleClick = () => {
    if (currentElement) {
      // Если товар уже в корзине, то удаляем его
      removeFromCart({ id: currentElement.id });
    } else {
      // Если товара нет в корзине, то добавляем его
      const cartItem: ICartItem = {
        id: Date.now(), // Генерируем уникальный id для нового элемента корзины
        games: product, // Товар сохраняется в поле games
        quantity: 1, // Устанавливаем количество товара в корзине
        price: product.price, // Устанавливаем цену товара
      };
      addToCart(cartItem); // Передаем исправленный объект
    }
  };

  return (
    <div className='mt-5'>
      <Button
        variant='orange'
        onClick={handleClick}
      >
        {currentElement ? 'Убрать из корзины' : 'Добавить в корзину'}
      </Button>
    </div>
  );
};

export default AddToCartInline;
