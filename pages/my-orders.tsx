import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading';
import { useState } from 'react';

const MyOrders = () => {
  const { data: orders } = useQuery({
    queryKey: ['my orders'],
    queryFn: () => OrderService.getByUserId(),
    select: (response) => response.data,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<number | null>(null);

  const handleCopy = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (error) {
      console.error('Ошибка копирования:', error);
    }
  };

  const handleToggleOrder = (orderId: number) => {
    setOpenOrder((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <Meta title="Мои заказы">
      <Layout>
        <Heading>Мои заказы</Heading>
        <section>
          <div className="max-h-[700px] overflow-y-auto pr-2">
            {orders?.length ? (
              orders.map((order: any) => {
                const status = order.status.toUpperCase();
                const bgClass =
                  status === 'COMPLETED'
                    ? 'bg-status-completed'
                    : status === 'PENDING'
                    ? 'bg-status-pending'
                    : '';

                return (
                  <div
                    key={order.order_id}
                    className={`
                      ${bgClass}
                      border border-gray rounded-xl shadow-sm
                      flex flex-col gap-4 p-6 my-6 font-semibold
                      transition-shadow
                    `}
                  >
                    <div className="flex flex-col sm:flex-row sm:gap-10 gap-2">
                      <span>#{order.order_id}</span>
                      <span>Статус: {order.status}</span>
                      <span>
                        Дата: {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span>Итого: {convertPrice(Number(order.total_amount))}</span>
                    </div>

                    {status === 'COMPLETED' && (
                      <button
                        onClick={() => handleToggleOrder(order.order_id)}
                        className="mt-2 text-blue-600 hover:underline text-sm"
                      >
                        {openOrder === order.order_id
                          ? 'Скрыть ключи'
                          : 'Показать ключи'}
                      </button>
                    )}

                    {openOrder === order.order_id &&
                      status === 'COMPLETED' &&
                      order.order_keys?.length > 0 && (
                        <div className="mt-4 text-sm font-normal text-gray-700">
                          <div className="font-semibold mb-2">
                            Ключи активации:
                          </div>
                          {order.order_keys.map((keyObj: any, idx: number) => (
                            <div key={idx} className="mb-6">
                              <div className="font-medium mb-1 text-base text-gray-800">
                                {keyObj.game.name}
                              </div>
                              <ul className="space-y-2">
                                {keyObj.activation_keys.map(
                                  (key: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md font-mono text-sm break-all max-w-[300px]">
                                        {key}
                                      </span>
                                      <button
                                        onClick={() => handleCopy(key)}
                                        className="text-blue-600 hover:underline text-xs"
                                      >
                                        {copiedKey === key
                                          ? 'Скопировано'
                                          : 'Скопировать'}
                                      </button>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })
            ) : (
              <div>Заказы не найдены!</div>
            )}
          </div>
        </section>
      </Layout>
    </Meta>
  );
};

export default MyOrders;
