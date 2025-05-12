import { useCart } from "@/src/hooks/useCart";
import { convertPrice } from "@/src/utils/convertPrice";
import { useRouter } from "next/router";
import { FC } from "react";
import { RiShoppingCartLine } from "react-icons/ri";
import { FiAlertTriangle } from 'react-icons/fi'; // Import an icon
import SquareButton from "../../../button/SquareButton";
import Button from "../../../button/Button";
import { useOutside } from "@/src/hooks/useOutside";
import { cn } from "@/src/utils/cn";
import CartItem from "./CartItem/CartItem";
import styles from './CartItem/Cart.module.scss';
import { useMutation } from "@tanstack/react-query";
import { OrderService } from "@/src/assets/styles/services/order.service";
import { IOrderRequest } from "@/src/assets/styles/services/order.types";
import toast from 'react-hot-toast';
import { AxiosError, AxiosResponse } from "axios";

interface ICreateOrderSuccessResponse {
    url: string;
    expires_at?: number;
    order_id: number;
    status: string;
    total_amount: number;
}

const Cart: FC = () => {
    const { isShow, setIsShow, ref } = useOutside(false);
    const { items, total } = useCart();
    const router = useRouter();

    const { mutate, isPending, error: mutationError, isError: isMutationError } = useMutation<
        AxiosResponse<ICreateOrderSuccessResponse>,
        AxiosError<{ message?: string; statusCode?: number }>,
        IOrderRequest
    >({
    mutationKey: ['create order'],
        mutationFn: (data: IOrderRequest) => OrderService.createOrder(data),
        onSuccess: (response) => {
            const backendData = response.data;
            if (backendData && backendData.url) {
                toast.success('Заказ успешно создан! Перенаправляем на оплату...');
                window.location.href = backendData.url;
            } else {
                console.error("URL для оплаты не получен после создания заказа:", backendData);
                toast.error("Не удалось получить ссылку на оплату. Пожалуйста, проверьте 'Мои заказы'.");
            }
        },
        onError: (error) => {
            const responseData = error.response?.data;
            const errorMessage = responseData?.message || error.message || 'Произошла ошибка при создании заказа.';
            
            const PENDING_ORDER_ERROR_MESSAGE_START = "У вас уже есть активный неоплаченный заказ";
            const PAYMENT_URL_REGEX = /Вы можете попробовать оплатить его здесь: (https:\/\/[^\s]+)/;

            if (typeof errorMessage === 'string' && errorMessage.startsWith(PENDING_ORDER_ERROR_MESSAGE_START)) {
                const match = errorMessage.match(PAYMENT_URL_REGEX);
                const paymentUrl = match && match[1] ? match[1] : null;

                if (paymentUrl) {
                    toast.custom((t) => (
                      // === MODIFIED TOAST LAYOUT START ===
                      <div
                        className={`${
                          t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-while shadow-xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5`}
                      >
                        {/* Content Area */}
                        <div className="p-5"> {/* Отступ для основного контента */}
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                              <FiAlertTriangle className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3.5 flex-1">
                              <p className="text-base font-semibold text-gray-800">
                                Активный заказ не оплачен
                              </p>
                              <p className="mt-1 text-sm text-gray-600">
                                У вас уже есть неоплаченный заказ. Хотите его оплатить или перейти к вашим заказам для отмены? Если вы не отмените заказ, то он автоматически отменится через 30 минут.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Button Area - теперь горизонтальная, внизу */}
                        <div className="px-5 pb-4 pt-3 bg-gray-50 rounded-b-xl flex flex-wrap justify-end items-center gap-3 border-t border-gray-200">
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            // Стиль для кнопки "Закрыть" (менее акцентная)
                            className="order-1 sm:order-1 px-4 py-2 text-sm font-medium text-black bg-gray-200 hover:bg-red-400 hover:text-while rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-150 ease-in-out"
                          >
                            Закрыть
                          </button>
                          <button
                            onClick={() => {
                              router.push('/my-orders');
                              toast.dismiss(t.id);
                              setIsShow(false);
                            }}
                            // Стиль для кнопки "К моим заказам" (вторичная)
                            className="order-3 sm:order-2 px-4 py-2 text-sm font-medium text-gray-700 bg-while border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-150 ease-in-out"
                          >
                            К моим заказам
                          </button>
                          <button
                            onClick={() => {
                              window.open(paymentUrl, '_blank');
                              toast.dismiss(t.id);
                              setIsShow(false);
                            }}
                            // Стиль для кнопки "Оплатить существующий" (основная)
                            className="order-2 sm:order-3 w-full sm:w-auto px-4 py-2 text-sm font-medium bg-primary text-while border border-transparent rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-1  transition-colors duration-150 ease-in-out hover:text-while"
                          >
                            Оплатить существующий
                          </button>
                        </div>
                      </div>
                      // === MODIFIED TOAST LAYOUT END ===
                    ), { duration: 20000, position: "top-center" });
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error(errorMessage);
            }
            console.error("Ошибка при создании заказа (детали):", responseData || error.message);
        },
    });

    const handleCheckout = () => {
        if (!items.length || isPending) return;

        const orderData: IOrderRequest = {
            items: items.map(item => ({
                game_id: item.games.game_id,
                quantity: item.quantity,
            })),
        };
        mutate(orderData);
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
                    'absolute top-[4.2rem] right-0 w-80 bg-gray-800 rounded-xl px-5 py-3 text-sm menu z-20 text-while',
                    isShow ? 'open-menu' : 'close-menu'
                )}
            >
                <div className='font-normal text-lg mb-5 text-while'>Корзина</div>

                <div className={styles.cart}>
                    {items.length > 0 ? (
                        items.map((item) => <CartItem item={item} key={item.id} />)
                    ) : (
                        <div className='font-light text-while py-4 text-left'>
                            Корзина пустая. Если хочешь, то добавь сюда какую нибудь игру.
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className="flex justify-between mb-2">
                            <span>Сумма заказа:</span>
                            <span>{convertPrice(total)}</span>
                        </div>
                        <div className='text-center'>
                            <Button
                                variant='orange'
                                className='w-full mt-3 mb-2'
                                onClick={handleCheckout}
                                disabled={isPending}
                            >
                                {isPending ? 'Оформление...' : 'Оформить заказ'}
                            </Button>
                        </div>
                    </div>
                )}
                 {isMutationError && 
                    mutationError &&
                    !(mutationError.response?.data?.message?.startsWith("У вас уже есть активный неоплаченный заказ")) && (
                    <div className="text-red-500 text-xs mt-2 p-2 bg-red-100 rounded">
                        {mutationError.response?.data?.message || mutationError.message || "Неизвестная ошибка"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;