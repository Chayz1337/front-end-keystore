import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Loader from '@/src/components/ui/Loader';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading';

const PaymentSuccess: FC = () => {
  const { orderId } = useRouter().query;  // Получаем orderId из URL
  const [orderData, setOrderData] = useState<any | null>(null);

  // Загружаем все заказы для пользователя
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['my orders'],
    queryFn: () => OrderService.getByUserId(),
    select: (response) => response.data,
  });

  useEffect(() => {
    if (orders && orderId) {
      const order = orders.find((order: any) => order.order_id === Number(orderId));
      setOrderData(order);  // Если заказ найден, сохраняем его в стейт
    }
  }, [orders, orderId]);

  // Если заказ не найден или произошла ошибка
  if (isError) return <div>Ошибка загрузки заказов!</div>;
  if (isLoading) return <Loader />;

  if (!orderData) return <div>Заказ не найден или произошла ошибка.</div>;

  // Статус заказа
  const status = orderData.status.toUpperCase();
  const bgClass =
    status === 'COMPLETED'
      ? 'bg-status-completed'
      : status === 'PENDING'
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
            <span>
              Дата: {new Date(orderData.created_at).toLocaleDateString()}
            </span>
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
                        <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md font-mono text-sm break-all max-w-[300px]">
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
