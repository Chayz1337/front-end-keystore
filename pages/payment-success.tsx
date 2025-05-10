import { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { OrderService } from '@/src/assets/styles/services/order.service';
import { convertPrice } from '@/src/utils/convertPrice';
import Loader from '@/src/components/ui/Loader';
import Meta from '@/src/components/ui/Meta';
import Layout from '@/src/components/ui/layout/Layout';
import Heading from '@/src/components/ui/button/Heading'; // Ваш компонент Heading
import { reset } from '@/src/store/cart/cart.slice';
import { EnumOrderStatus, IOrder } from '@/src/types/order.interface'; // Предполагаем, что IOrder определен
import { FiCheckCircle, FiClock, FiAlertTriangle, FiCopy, FiArchive } from 'react-icons/fi'; // Иконки
import toast from 'react-hot-toast'; // Для уведомления о копировании

// Используем ваш тип IOrder. PageOrderData теперь просто наследует все от IOrder.
// Если вам нужны дополнительные, НЕ конфликтующие поля для этой страницы, их можно добавить сюда.
interface PageOrderData extends IOrder {
    // Свойство order_keys теперь будет полностью наследоваться из IOrder.
    // Его переопределение отсюда удалено.
}

const PaymentSuccess: FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [orderData, setOrderData] = useState<PageOrderData | null>(null);
  const dispatch = useDispatch();
  const cleared = useRef(false);

  // Ваша логика получения данных
  const { data: orders, isLoading, isError: queryIsError, error: queryError } = useQuery<PageOrderData[], Error>({
    queryKey: ['my orders for payment success', orderId],
    queryFn: () => OrderService.getByUserId().then(response => response.data as PageOrderData[]),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (orders && orderId && !cleared.current) {
      const order = orders.find((o: PageOrderData) => o.order_id === Number(orderId));
      setOrderData(order || null);

      if (order?.status === EnumOrderStatus.COMPLETED) {
        dispatch(reset());
        cleared.current = true;
      }
    }
  }, [orders, orderId, dispatch]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
      .then(() => {
        toast.success('Ключ скопирован!', {
          icon: <FiCheckCircle className="text-green-500" />,
        });
      })
      .catch(err => {
        toast.error('Не удалось скопировать ключ.');
        console.error('Failed to copy key: ', err);
      });
  };

  // --- Улучшенные состояния загрузки и ошибок ---
  if (isLoading) {
    return (
      <Meta title="Загрузка информации...">
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader />
            <p className="mt-4 text-lg text-gray-600">Загружаем детали вашего заказа...</p>
          </div>
        </Layout>
      </Meta>
    );
  }

  if (queryIsError) {
    return (
      <Meta title="Ошибка">
        <Layout>
           <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] p-4">
            <FiAlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <Heading>Ошибка загрузки заказа</Heading> {/* Используем ваш компонент Heading */}
            <p className="mt-2 text-gray-600 max-w-md">
              Не удалось загрузить информацию. Пожалуйста, попробуйте обновить страницу.
            </p>
            {queryError && <p className="mt-1 text-sm text-gray-500">Детали: {queryError.message}</p>}
            <button
                onClick={() => router.reload()}
                className="mt-6 px-6 py-2 bg-primary text-while rounded-lg hover:opacity-90 transition-opacity"
            >
                Обновить страницу
            </button>
          </div>
        </Layout>
      </Meta>
    );
  }

  if (!orderData) {
    return (
      <Meta title="Заказ не найден">
        <Layout>
          <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] p-4">
            <FiArchive className="w-16 h-16 text-gray-400 mb-4" />
            <Heading>Заказ не найден</Heading> {/* Используем ваш компонент Heading */}
            <p className="mt-2 text-gray-600 max-w-md">
              Заказ с ID <span className="font-semibold">{orderId}</span> не найден.
            </p>
            <button
                onClick={() => router.push('/my-orders')}
                className="mt-6 px-6 py-2 bg-secondary text-while rounded-lg hover:opacity-80 transition-opacity"
            >
                Перейти к моим заказам
            </button>
          </div>
        </Layout>
      </Meta>
    );
  }
  // --- Конец улучшенных состояний ---


  const status = orderData.status;
  let statusIcon, pageTitle, statusMessage, mainBgClass, mainBorderClass, headingTextColor;

  // Используем ваши цвета из tailwind.config.js для bg-status-completed и bg-status-pending
  // или определяем более мягкие версии для фона контейнера
  const softCompletedBg = 'bg-green-50'; // Пример мягкого фона
  const softPendingBg = 'bg-orange-50';   // Пример мягкого фона

  switch (status) {
    case EnumOrderStatus.COMPLETED:
      statusIcon = <FiCheckCircle className="w-12 h-12 text-green-500" />;
      pageTitle = "Оплата успешна";
      statusMessage = "Ваш заказ успешно оплачен и обработан!";
      mainBgClass = softCompletedBg; // Используем ваш 'bg-status-completed' если хотите полупрозрачный
      mainBorderClass = 'border-green-400';
      headingTextColor = 'text-green-700';
      break;
    case EnumOrderStatus.PENDING:
      statusIcon = <FiClock className="w-12 h-12 text-orange-500" />;
      pageTitle = "Заказ в обработке";
      statusMessage = "Ваш заказ ожидает подтверждения оплаты.";
      mainBgClass = softPendingBg; // Используем ваш 'bg-status-pending' если хотите полупрозрачный
      mainBorderClass = 'border-orange-400';
      headingTextColor = 'text-orange-700';
      break;
    default:
      statusIcon = <FiAlertTriangle className="w-12 h-12 text-gray-500" />;
      pageTitle = "Статус заказа";
      statusMessage = `Статус вашего заказа: ${status}`;
      mainBgClass = 'bg-gray-50';
      mainBorderClass = 'border-gray-300';
      headingTextColor = 'text-gray-700';
  }


  return (
    <Meta title={pageTitle}>
      <Layout>
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {statusIcon}
            {/* Используем ваш компонент Heading или простой h1 */}
            <h1 className={`mt-3 text-3xl font-extrabold ${headingTextColor}`}>
              {pageTitle}!
            </h1>
            <p className="mt-2 text-lg text-gray-600">{statusMessage}</p>
          </div>

          <section className={`border ${mainBorderClass} ${mainBgClass} rounded-xl shadow-lg p-6 sm:p-8`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-300">
              Детали заказа #{orderData.order_id}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
              <div>
                <span className="font-medium text-gray-500 block">Статус:</span>
                <span className={`font-semibold ${headingTextColor}`}>{orderData.status}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500 block">Дата:</span>
                <span className="text-gray-700">
                  {new Date(orderData.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="md:col-span-2 mt-2">
                <span className="font-medium text-gray-500 block">Итого:</span>
                <span className="text-2xl font-bold text-black">{convertPrice(Number(orderData.total_amount))}</span>
              </div>
            </div>

            {status === EnumOrderStatus.COMPLETED && orderData.order_keys && orderData.order_keys.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ключи активации:
                </h3>
                <div className="space-y-6">
                  {orderData.order_keys.map((keyObj, idx) => (
                    <div key={idx} className="p-4 bg-while border border-gray-200 rounded-lg shadow-sm">
                      <div className="text-md font-semibold text-gray-700 mb-3">
                        {/* Предполагаем, что IOrder.order_keys[n].game имеет свойство 'name' */}
                        {keyObj.game.name} 
                      </div>
                      <ul className="space-y-3">
                        {keyObj.activation_keys.map((key, i) => (
                          <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors">
                            <span
                              className="font-mono text-sm text-slate-700 break-all select-all flex-grow"
                            >
                              {key}
                            </span>
                            <button
                              onClick={() => handleCopyKey(key)}
                              className="flex items-center justify-center mt-2 sm:mt-0 w-full sm:w-auto px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-xs font-medium transition-colors"
                              title="Скопировать ключ"
                            >
                              <FiCopy className="mr-1.5" />
                              Копировать
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопка "Перейти к моим заказам" */}
            <div className="mt-10 text-center">
                <button
                    onClick={() => router.push('/my-orders')}
                    className="px-8 py-3 bg-primary text-while text-base font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                    Перейти к моим заказам
                </button>
            </div>
          </section>
        </div>
      </Layout>
    </Meta>
  );
};

export default PaymentSuccess;