import { useCart } from "@/src/hooks/useCart";
import { convertPrice } from "@/src/utils/convertPrice";
import { useRouter } from "next/router";
import { FC } from "react";
import { RiShoppingCartLine } from "react-icons/ri";
import SquareButton from "../../../button/SquareButton";
import Button from "../../../button/Button";
import { useOutside } from "@/src/hooks/useOutside";
import { cn } from "@/src/utils/cn";
import CartItem from "./CartItem/CartItem";
import styles from './CartItem/Cart.module.scss';
import { useMutation } from "@tanstack/react-query";
import { OrderService } from "@/src/assets/styles/services/order.service";
import { IOrderRequest } from "@/src/assets/styles/services/order.types";

const Cart: FC = () => {
    const { isShow, setIsShow, ref } = useOutside(false);
    const { items, total } = useCart();
    const { push } = useRouter();
    console.log('Данные для отправки:', items);  // Логируем данные
    const { mutate, isError, error } = useMutation({
        mutationKey: ['create order'],
        mutationFn: (data: IOrderRequest) => OrderService.createOrder(data),
        onSuccess: (response) => {
            if (response?.data?.url) {
                window.location.href = response.data.url; // Перенаправление на страницу оплаты через Stripe
            }
        },
        onError: (error: any) => {
            console.error("Ошибка при создании заказа:", error?.response?.data || error.message);
        },
    });

    const handleCheckout = () => {
        if (!items.length) return; // Если корзина пуста, не продолжать

        const orderData: IOrderRequest = {
            items: items.map(item => ({
                game_id: item.games.game_id,
                quantity: item.quantity,
            })),
        };

        mutate(orderData); // Запуск мутации для создания заказа
    };

    return (
        <div className='relative' ref={ref}>
            <SquareButton
                Icon={RiShoppingCartLine}
                onClick={() => setIsShow(!isShow)}
                number={items.length}
            />

            <div
                className={cn(
                    'absolute top-[4.2rem] right-0 w-80 bg-secondary rounded-xl px-5 py-3 text-sm menu z-20 text-while',
                    isShow ? 'open-menu' : 'close-menu'
                )}
            >
                <div className='font-normal text-lg mb-5 text-while'>Корзина</div>

                <div className={styles.cart}>
                    {items.length ? (
                        items.map((item) => <CartItem item={item} key={item.id} />)
                    ) : (
                        <div className='font-light text-while w-30'>
                            Корзина пустая. Добавьте сюда то, что хотели бы приобрести.
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <div>Сумма заказа:</div>
                    <div>{convertPrice(total)}</div>
                    <div className='text-center'>
                        <Button
                            variant='white'
                            className='btn-link mt-5 mb-2'
                            onClick={handleCheckout}
                
                        >
                            {'Оформить заказ'}
                        </Button>
                    </div>

                    {isError && (
                        <div className="text-red-500 text-sm mt-2">
                            Ошибка при оформлении заказа: {error?.response?.data?.message || error.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
