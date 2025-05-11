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
import { reset } from '@/src/store/cart/cart.slice';
import { EnumOrderStatus, IOrder } from '@/src/types/order.interface';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiCopy, FiArchive } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PageOrderData extends IOrder {}

// Функция для получения русского названия статуса
const getOrderStatusRussian = (status: EnumOrderStatus): string => {
  switch (status) {
    case EnumOrderStatus.COMPLETED:
      return 'Оплачено';
    case EnumOrderStatus.PENDING:
      return 'В обработке';
    // Добавьте другие статусы по необходимости
    // case EnumOrderStatus.CANCELED:
    //   return 'Отменен';
    default:
      // Если статус неизвестен или не требует перевода, возвращаем как есть
      // или можно вернуть стандартизированную строку, например, status.toString()
      return status as string;
  }
};

const PaymentSuccess: FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [orderData, setOrderData] = useState<PageOrderData | null>(null);
  const dispatch = useDispatch();
  const cleared = useRef(false);

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
            <Heading>Ошибка загрузки заказа</Heading>
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
            <Heading>Заказ не найден</Heading>
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

  const status = orderData.status;
  let statusIcon, pageTitle, statusMessage, mainBgClass, mainBorderClass, headingTextColor;

  // Уменьшим размер иконок для отображения рядом с заголовком
  const iconSizeClasses = "w-10 h-10"; // или "w-8 h-8" если 10 много

  switch (status) {
    case EnumOrderStatus.COMPLETED:
      statusIcon = <FiCheckCircle className={`${iconSizeClasses} text-green-500`} />;
      pageTitle = "Оплата успешна";
      statusMessage = "Ваш заказ успешно оплачен и обработан!";
      mainBgClass = 'bg-gray-50'; // Нейтральный фон для секции деталей
      mainBorderClass = 'border-gray-300'; // Нейтральная граница (можно 'border-green-300' для легкого акцента)
      headingTextColor = 'text-green-600'; // Зеленый для заголовка и текста статуса
      break;
    case EnumOrderStatus.PENDING:
      statusIcon = <FiClock className={`${iconSizeClasses} text-orange-500`} />;
      pageTitle = "Заказ в обработке";
      statusMessage = "Ваш заказ ожидает подтверждения оплаты.";
      mainBgClass = 'bg-orange-50';
      mainBorderClass = 'border-orange-400';
      headingTextColor = 'text-orange-700';
      break;
    default:
      statusIcon = <FiAlertTriangle className={`${iconSizeClasses} text-gray-500`} />;
      pageTitle = "Статус заказа";
      // Используем getOrderStatusRussian для отображения статуса по умолчанию
      statusMessage = `Статус вашего заказа: ${getOrderStatusRussian(status as EnumOrderStatus)}`;
      mainBgClass = 'bg-gray-50';
      mainBorderClass = 'border-gray-300';
      headingTextColor = 'text-gray-700';
  }


  return (
    <Meta title={pageTitle}>
      <Layout>
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Измененный блок заголовка: иконка слева от текста */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-x-3 mb-3">
              {statusIcon}
              <h1 className={`text-3xl font-extrabold ${headingTextColor}`}>
                {pageTitle}!
              </h1>
            </div>
            <p className="mt-1 text-lg text-gray-600">{statusMessage}</p>
          </div>

          <section className={`border ${mainBorderClass} ${mainBgClass} rounded-xl shadow-lg p-6 sm:p-8`}>
            <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-300">
              Детали заказа #{orderData.order_id}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
              <div>
                <span className="font-medium text-gray-500 block">Статус:</span>
                {/* Используем getOrderStatusRussian и headingTextColor для цвета статуса */}
                <span className={`font-semibold ${headingTextColor}`}>{getOrderStatusRussian(orderData.status)}</span>
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