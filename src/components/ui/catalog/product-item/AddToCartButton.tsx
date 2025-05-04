import { useCart } from "@/src/hooks/useCart";
import { useActions } from "@/src/hooks/user.actions";
import { IProduct } from "@/src/types/product.interface"; // или Game
import { FC } from "react";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";

// Пропсы остались прежними: нужны games и availableKeys
interface AddToCartButtonProps {
    games: IProduct; // или Game
    availableKeys: number | null; // Количество доступных ключей
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ games, availableKeys }) => {
    const { addToCart, removeFromCart } = useActions();
    const { items } = useCart();

    // Ищем элемент в корзине (как и раньше)
    const currentElement = items.find(
        cartItem => cartItem.games.game_id === games.game_id
    );

    // Определяем действие добавления (с проверкой!) для inline onClick
    const addAction = () => {
        // Проверяем наличие перед добавлением
        if (typeof availableKeys === 'number' && availableKeys > 0) {
             console.log(`[AddToCartButton] Добавляем ${games.name}, доступно: ${availableKeys}`);
             addToCart({
                games: games,
                quantity: 1,
                price: games.price,
                availableStock: availableKeys // Передаем лимит
            });
        } else {
            // Ничего не делаем или показываем alert, если товара нет/инфо недоступно
            console.warn(`[AddToCartButton] Нельзя добавить ${games.name}. availableKeys: ${availableKeys}`);
            alert(`Невозможно добавить "${games.name}". Нет в наличии или информация недоступна.`);
        }
    };

    return (
        <div>
            {/* Используем оригинальную структуру с inline onClick */}
            <button
                className="text-primary" // Вернули исходный класс (можешь добавить свои, если были)
                onClick={() =>
                    currentElement
                        ? removeFromCart({ id: currentElement.id }) // Если есть - удаляем
                        : addAction()                             // Если нет - вызываем addAction с проверкой
                }
                aria-label={currentElement ? 'Удалить из корзины' : 'Добавить в корзину'}
            >
                {/* Иконка меняется в зависимости от наличия в корзине */}
                {currentElement ? <RiShoppingCartFill /> : <RiShoppingCartLine />}
            </button>
        </div>
    );
};

export default AddToCartButton;