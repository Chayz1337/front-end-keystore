// pages/my-orders.tsx
import { useQuery } from '@tanstack/react-query';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading';
import Button from '@/src/components/ui/button/Button';
import { useState, FC } from 'react';
import { EnumOrderStatus, IOrder } from '@/src/types/order.intefrace';
import KeysDisplayModal from '@/src/components/ui/modal/KeysDisplayModal';
import Loader from '@/src/components/ui/Loader';
// import { FiCheckCircle, FiClock, FiAlertCircle, FiExternalLink, FiKey } from 'react-icons/fi'; // Иконки

interface StatusDisplayInfo {
  text: string;
  textColor: string;
  borderColorCard: string;
  indicatorColorStyle: string; // CSS значение цвета для backgroundColor кружка
}

const orderStatusMap: Record<EnumOrderStatus, StatusDisplayInfo> = {
  [EnumOrderStatus.COMPLETED]: {
    text: 'Завершен',
    textColor: 'text-green-700',
    borderColorCard: 'border-green-500',
    indicatorColorStyle: '#10B981', // Tailwind green-500
  },
  [EnumOrderStatus.PENDING]: {
    text: 'В ожидании оплаты',
    textColor: 'text-orange-700',
    borderColorCard: 'border-orange-500',
    indicatorColorStyle: '#F59E0B',    // Tailwind amber-500 (orange-500 это #F97316)
                                      // Можешь использовать '#F97316' для более насыщенного оранжевого
  },
  // Добавь другие статусы, если есть:
  // [EnumOrderStatus.FAILED]: { 
  //   text: 'Платеж не прошел', 
  //   textColor: 'text-red-700', 
  //   borderColorCard: 'border-red-500', 
  //   indicatorColorStyle: '#EF4444' // Tailwind red-500
  // },
};

const MyOrders: FC = () => {
  const { data: ordersData, isLoading, isError } = useQuery<{ data: IOrder[] }>({
    queryKey: ['my orders'],
    queryFn: () => OrderService.getByUserId(),
  });

  const orders = ordersData?.data || [];

  const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
  const [selectedOrderForKeys, setSelectedOrderForKeys] = useState<IOrder | null>(null);

  const handleOpenKeysModal = (order: IOrder) => {
    setSelectedOrderForKeys(order);
    setIsKeysModalOpen(true);
  };

  const handleCloseKeysModal = () => {
    setIsKeysModalOpen(false);
    setSelectedOrderForKeys(null);
  };
  
  // Расчет статистики по заказам
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(order => order.status === EnumOrderStatus.COMPLETED).length;
  const pendingOrdersCount = orders.filter(order => order.status === EnumOrderStatus.PENDING).length;
  // const failedOrdersCount = orders.filter(order => order.status === EnumOrderStatus.FAILED).length; // Для FAILED статуса

  // --- JSX для состояний загрузки и ошибки ---
  if (isLoading) {
    return (
        <Layout>
            <Meta title="Мои заказы" />
            <div className="mb-6"><Heading>Мои заказы</Heading></div>
            <div className="flex justify-center items-center py-20"><Loader /></div>
        </Layout>
    );
  }
  if (isError || !ordersData) {
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
  // --- Конец JSX для состояний загрузки и ошибки ---

  return (
    <Meta title="Мои заказы">
      <Layout>
        {/* Заголовок и статистика */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-x-4 gap-y-2 mb-6 pb-4 border-b border-gray-200">
          <Heading>Мои заказы</Heading>
          {totalOrdersCount > 0 && !isLoading && (
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
                  <span>В ожидании оплаты: <span className="font-bold text-gray-800">{pendingOrdersCount}</span></span>
                </div>
              )}
              {/* Добавь здесь другие статусы, если нужно */}
            </div>
          )}
        </div>

        <section>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto pr-1 -mr-1 custom-scrollbar" > {/* Подстроил max-h */}
            {orders.length > 0 ? (
              <div className="flex flex-col items-center px-1"> {/* Центрирование карточек */}
                {orders.map((order: IOrder) => {
                  const statusInfo = orderStatusMap[order.status] || { 
                    text: order.status, 
                    textColor: 'text-gray-700', 
                    borderColorCard: 'border-gray-300',
                    indicatorColorStyle: '#9CA3AF' // Дефолтный серый для неизвестных статусов
                  };
                  return (
                    <div 
                      key={order.order_id} 
                      className={`
                        bg-while border ${statusInfo.borderColorCard} 
                        rounded-xl shadow-lg p-4 sm:p-5 my-3 sm:my-4 
                        w-full max-w-xl md:max-w-3xl transition-all duration-300 ease-in-out hover:shadow-xl
                      `}
                    >
                      {/* Верхняя часть: Номер заказа, Дата, Статус */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 pb-3 border-b border-gray-200 gap-2">
                        <div>
                          <h3 className="text-md sm:text-lg font-semibold text-gray-800">Заказ #{order.order_id}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Дата: {new Date(order.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        {/* Статус с цветным кружком */}
                        <div className="mt-1 sm:mt-0 flex items-center self-start sm:self-center whitespace-nowrap">
                          <div 
                            style={{ backgroundColor: statusInfo.indicatorColorStyle }}
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mr-2 flex-shrink-0" // Адаптивный размер кружка
                            aria-hidden="true"
                          ></div>
                          <span 
                            className={`text-xs sm:text-sm font-medium ${statusInfo.textColor}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>
                      </div>

                      {/* Средняя часть: Итоговая сумма */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Итого:</span>
                          <span className="text-lg sm:text-xl font-bold text-black ">{convertPrice(Number(order.total_amount))}</span>
                        </div>
                      </div>
                      
                      {/* Нижняя часть: Кнопки действий */}
                      <div className="flex flex-col items-stretch gap-2.5 pt-3 border-t border-gray-200 mt-3 sm:flex-row sm:justify-end sm:items-center">
                        {order.status === EnumOrderStatus.PENDING && order.payment_url && (
                           <Button 
                              variant="orange" 
                              rel="noopener noreferrer"
                              className="text-center text-sm px-4 py-2" // Убраны w-full, sm:w-auto
                           >
                             Оплатить
                           </Button>
                        )}
                        {order.status === EnumOrderStatus.COMPLETED && order.order_keys && order.order_keys.length > 0 && (
                          <Button
                            variant="orange" 
                            onClick={() => handleOpenKeysModal(order)}
                            className="text-center text-sm px-4 py-2" // Убраны w-full, sm:w-auto
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
              !isLoading && ( // Показываем "нет заказов" только если загрузка завершилась
                <div className="text-center text-gray-500 py-20">
                  <p className="text-xl mb-2">📂</p> {/* Можно добавить иконку */}
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