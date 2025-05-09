import { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Loader from '@/src/components/ui/Loader';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading';
import { reset } from '@/src/store/cart/cart.slice'; // ⬅️ Импорт очистки корзины
import { EnumOrderStatus } from '@/src/types/order.intefrace';


const PaymentSuccess: FC = () => {
  const { orderId } = useRouter().query;
  const [orderData, setOrderData] = useState<any | null>(null);
  const dispatch = useDispatch();
  const cleared = useRef(false); // ⬅️ Чтобы не очищать корзину несколько раз

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['my orders'],
    queryFn: () => OrderService.getByUserId(),
    select: (response) => response.data,
  });

  useEffect(() => {
    if (orders && orderId && !cleared.current) {
      const order = orders.find((order: any) => order.order_id === Number(orderId));
      setOrderData(order);

      // ⬅️ Очищаем корзину только если заказ завершён
      if (order?.status === EnumOrderStatus.COMPLETED) {
        dispatch(reset());
        cleared.current = true;
      }
    }
  }, [orders, orderId, dispatch]);

  if (isError) return <div>Ошибка загрузки заказов!</div>;
  if (isLoading) return <Loader />;
  if (!orderData) return <div>Заказ не найден или произошла ошибка.</div>;

const status = orderData.status;
const bgClass =
  status === EnumOrderStatus.COMPLETED
    ? 'bg-status-completed'
    : status === EnumOrderStatus.PENDING
    ? 'bg-status-pending'
    : '';

  return (
    <Meta title="Оплата успешна">
      <Layout>
        <Heading>Оплата успешна!</Heading>
        <section className={`border border-gray rounded-xl shadow-sm p-6 mt-6 ${bgClass}`}>
          <div className="flex flex-col sm:flex-row sm:gap-10 gap-2">
            <span>Заказ #{orderData.order_id}</span>
            <span>Статус: {orderData.status}</span>
            <span>Дата: {new Date(orderData.created_at).toLocaleDateString()}</span>
            <span>Итого: {convertPrice(Number(orderData.total_amount))}</span>
          </div>

          {status === 'COMPLETED' && orderData.order_keys?.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-2">Ключи активации:</div>
              {orderData.order_keys.map((keyObj: any, idx: number) => (
                <div key={idx} className="mb-6">
                  <div className="font-medium mb-1 text-base text-gray-800">
                    Игра: {keyObj.game.name}
                  </div>
                  <ul className="space-y-2">
                    {keyObj.activation_keys.map((key: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md font-mono text-sm break-all max-w-[300px] cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(key)}
                          title="Нажмите для копирования"
                        >
                          {key}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </Layout>
    </Meta>
  );
};

export default PaymentSuccess;
