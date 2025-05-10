// pages/my-orders.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading';
import Button from '@/src/components/ui/button/Button';
import { useState, FC } from 'react';
import { EnumOrderStatus, IOrder } from '@/src/types/order.interface';
import KeysDisplayModal from '@/src/components/ui/modal/KeysDisplayModal';
import Loader from '@/src/components/ui/Loader';
import toast from 'react-hot-toast';
import { AxiosResponse } from 'axios';
// import CountdownTimer from '@/src/components/ui/CountdownTimer'; // УБРАН ИМПОРТ ТАЙМЕРА

interface StatusDisplayInfo {
  text: string;
  textColor: string;
  borderColorCard: string;
  indicatorColorStyle: string;
}

const orderStatusMap: Record<EnumOrderStatus, StatusDisplayInfo> = {
  [EnumOrderStatus.COMPLETED]: {
    text: 'Завершен',
    textColor: 'text-green-700',
    borderColorCard: 'border-green-500',
    indicatorColorStyle: '#10B981',
  },
  [EnumOrderStatus.PENDING]: {
    text: 'В ожидании оплаты',
    textColor: 'text-orange-700',
    borderColorCard: 'border-orange-500',
    indicatorColorStyle: '#F59E0B',
  },
  [EnumOrderStatus.CANCELLED]: {
    text: 'Отменен',
    textColor: 'text-red-700',
    borderColorCard: 'border-red-500',
    indicatorColorStyle: '#EF4444',
  },
  [EnumOrderStatus.FAILED]: {
    text: 'Платеж не прошел',
    textColor: 'text-red-700',
    borderColorCard: 'border-red-500',
    indicatorColorStyle: '#EF4444'
  },
};

const MyOrders: FC = () => {
  const queryClient = useQueryClient();

  const { data: fetchedOrders, isLoading, isError } = useQuery<IOrder[], Error>({
    queryKey: ['my orders'],
    queryFn: async (): Promise<IOrder[]> => {
      try {
        const axiosResponse: AxiosResponse<IOrder[]> = await OrderService.getByUserId();
        if (axiosResponse && Array.isArray(axiosResponse.data)) {
          return axiosResponse.data; 
        } else {
          console.warn('API (my orders) не вернул ожидаемый массив заказов в response.data:', axiosResponse);
          return [];
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        throw error;
      }
    },
  });
  
 const orders: IOrder[] = Array.isArray(fetchedOrders) ? fetchedOrders : [];


  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [selectedOrderForKeys, setSelectedOrderForKeys] = useState<IOrder | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  const handleOpenKeysModal = (order: IOrder) => {
    setSelectedOrderForKeys(order);
    setIsKeysModalOpen(true);
  };

  const handleCloseKeysModal = () => {
    setIsKeysModalOpen(false);
    setSelectedOrderForKeys(null);
  };

  const cancelOrderMutation = useMutation<AxiosResponse<{ message: string; order_id: number; new_status: string }>, Error, number>({
    mutationFn: (orderId: number) => OrderService.cancelOrder(orderId),
    onSuccess: (response) => {
      toast.success(response.data.message || 'Заказ успешно отменен!');
      queryClient.invalidateQueries({ queryKey: ['my orders'] });
    },
    onError: (error: any) => { 
      toast.error(error?.response?.data?.message || 'Ошибка при отмене заказа.');
    },
    onSettled: () => {
      setCancellingOrderId(null);
    }
  });

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('Вы уверены, что хотите отменить этот заказ? Это действие необратимо.')) {
      setCancellingOrderId(orderId);
      cancelOrderMutation.mutate(orderId);
    }
  };
  
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(order => order.status === EnumOrderStatus.COMPLETED).length;
  const pendingOrdersCount = orders.filter(order => order.status === EnumOrderStatus.PENDING).length;
  const cancelledOrdersCount = orders.filter(order => order.status === EnumOrderStatus.CANCELLED).length;

  if (isLoading) {
    return (
        <Layout>
            <Meta title="Мои заказы" />
            <div className="mb-6"><Heading>Мои заказы</Heading></div>
            <div className="flex justify-center items-center py-20"><Loader /></div>
        </Layout>
    );
  }
  if (isError) {
    return (
        <Layout>
            <Meta title="Мои заказы" />
            <div className="mb-6"><Heading>Мои заказы</Heading></div>
            <p className="text-center text-red-500 mt-10">
                Произошла ошибка при загрузке ваших заказов. Пожалуйста, попробуйте позже.
            </p>
        </Layout>
    );
  }

  return (
    <Meta title="Мои заказы">
      <Layout>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-x-4 gap-y-2 mb-6 pb-4 border-b border-gray-400">
          <Heading>Мои заказы</Heading>
          {totalOrdersCount > 0 && (
            <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-1 sm:mt-0">
              <span>Всего: <span className="font-bold text-gray-800">{totalOrdersCount}</span></span>
              {completedOrdersCount > 0 && (
                <div className="flex items-center">
                  <span 
                    style={{ backgroundColor: orderStatusMap[EnumOrderStatus.COMPLETED]?.indicatorColorStyle || '#9CA3AF' }} 
                    className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"
                  ></span>
                  <span>Успешных: <span className="font-bold text-gray-800">{completedOrdersCount}</span></span>
                </div>
              )}
              {pendingOrdersCount > 0 && (
                <div className="flex items-center">
                  <span 
                    style={{ backgroundColor: orderStatusMap[EnumOrderStatus.PENDING]?.indicatorColorStyle || '#9CA3AF' }} 
                    className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"
                  ></span>
                  <span>В ожидании: <span className="font-bold text-gray-800">{pendingOrdersCount}</span></span>
                </div>
              )}
              {cancelledOrdersCount > 0 && (
                <div className="flex items-center">
                  <span 
                    style={{ backgroundColor: orderStatusMap[EnumOrderStatus.CANCELLED]?.indicatorColorStyle || '#9CA3AF' }} 
                    className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"
                  ></span>
                  <span>Отмененных: <span className="font-bold text-gray-800">{cancelledOrdersCount}</span></span>
                </div>
              )}
            </div>
          )}
        </div>

        <section>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 -mr-1 custom-scrollbar" >
            {orders.length > 0 ? (
              <div className="flex flex-col items-center px-1">
                {orders.map((order: IOrder) => {
                  const statusInfo = orderStatusMap[order.status] || { 
                    text: order.status, 
                    textColor: 'text-gray-700', 
                    borderColorCard: 'border-gray-300',
                    indicatorColorStyle: '#9CA3AF'
                  };
                  const latestPayment = order.payments && order.payments.length > 0 ? order.payments[0] : null;
                  const paymentUrl = latestPayment?.session_url || null;
                  // УБРАНА ЛОГИКА СВЯЗАННАЯ С paymentExpiresAt и isPaymentTimeExpired
      if (order.status === EnumOrderStatus.PENDING) {
                    console.log("-----------------------------------------");
                    console.log(`ЗАКАЗ ID: ${order.order_id} (СТАТУС: PENDING)`);
                    console.log("Полный объект заказа (order):", JSON.parse(JSON.stringify(order))); // Глубокое копирование для лучшего вывода
                    console.log("Массив order.payments:", order.payments);
                    console.log("Объект latestPayment:", latestPayment);
                    console.log("Извлеченный paymentUrl:", paymentUrl);
                    console.log("-----------------------------------------");
                  }
                  return (
                    <div 
                      key={order.order_id} 
                      className={`
                        bg-while border ${statusInfo.borderColorCard} 
                        rounded-xl shadow-lg p-4 sm:p-5 my-3 sm:my-4 
                        w-full max-w-xl md:max-w-3xl transition-all duration-300 ease-in-out hover:shadow-xl
                      `}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 pb-3 border-b border-gray-400 gap-2">
                        <div>
                          <h3 className="text-md sm:text-lg font-semibold text-gray-800">Заказ #{order.order_id}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Дата: {new Date(order.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        {/* Блок статуса теперь без таймера */}
                        <div className="mt-1 sm:mt-0 flex items-center self-start sm:self-center whitespace-nowrap">
                          <div 
                            style={{ backgroundColor: statusInfo.indicatorColorStyle }}
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mr-2 flex-shrink-0"
                            aria-hidden="true"
                          ></div>
                          <span className={`text-xs sm:text-sm font-medium ${statusInfo.textColor}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-m text-aqua font-semibold">Итого:</span>
                          <span className="text-lg sm:text-xl font-bold text-black ">{convertPrice(Number(order.total_amount))}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-stretch gap-2.5 pt-3 border-t border-gray-400 mt-3 sm:flex-row sm:justify-end sm:items-center">
                        {/* Кнопка "Оплатить" теперь не зависит от времени истечения */}
                        {order.status === EnumOrderStatus.PENDING && paymentUrl && (
                           <Button 
                              variant="orange"
                              as="a"
                              href={paymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-center text-sm px-4 py-2"
                           >
                             Оплатить
                           </Button>
                        )}
                        {order.status === EnumOrderStatus.PENDING && (
                          <Button
                            variant="orange"
                            onClick={() => handleCancelOrder(order.order_id)}
                            disabled={cancellingOrderId === order.order_id || cancelOrderMutation.isPending}
                            className="text-center text-sm px-4 py-2"
                          >
                            {cancellingOrderId === order.order_id ? 'Отмена...' : 'Отменить заказ'}
                          </Button>
                        )}
                        {order.status === EnumOrderStatus.COMPLETED && order.order_keys && order.order_keys.length > 0 && (
                          <Button
                            variant="orange" 
                            onClick={() => handleOpenKeysModal(order)}
                            className="text-center text-sm px-4 py-2"
                          >
                            Ключи активации
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              !isLoading && ( 
                <div className="text-center text-gray-500 py-20">
                  <p className="text-xl mb-2">📂</p>
                  У вас пока нет заказов.
                </div>
              )
            )}
          </div>
        </section>
      </Layout>

      {isKeysModalOpen && selectedOrderForKeys && (
        <KeysDisplayModal
          order={selectedOrderForKeys}
          onClose={handleCloseKeysModal}
        />
      )}
    </Meta>
  );
};

export default MyOrders;