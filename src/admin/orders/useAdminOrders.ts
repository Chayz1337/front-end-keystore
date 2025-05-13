// src/admin/orders/useAdminOrders.ts
import { OrderService } from '@/src/assets/styles/services/order.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { getAdminUrl } from '@/src/config/url.config';
import { convertPrice } from '@/src/utils/convertPrice';
import { formatDate } from '@/src/utils/format-date';
import { useQuery } from '@tanstack/react-query';
import { IOrder } from '@/src/types/order.interface';      // IOrder теперь ожидает user: IUser | null
import { IUser } from '@/src/types/user.interface';        // IUser импортирован
import { AxiosResponse } from 'axios';

export const useAdminOrders = () => {
  const { data = [], isFetching } = useQuery<
    AxiosResponse<IOrder[]>,
    Error,
    IListItem[],
    string[]
  >({
    queryKey: ['get admin orders'],
    queryFn: () => OrderService.getAll(),
    select: (response) => {
      const ordersArray = response.data;
      
      if (!ordersArray || !Array.isArray(ordersArray)) {
        return [];
      }

      return ordersArray.map((order): IListItem => {
        if (!order) {
          return { id: Date.now(), items: ['Ошибка данных', '', '', '', '', '', ''] };
        }

        // Доступ к данным пользователя через order.user
        // Используем опциональную цепочку и значения по умолчанию
        const userIdText = order.user?.id ? String(order.user.id) : 'N/A (ID)';
        const userEmailText = order.user?.email || 'N/A (Email)';
        const userNameText = order.user?.name || 'Имя не указано'; 

        // ОТЛАДКА: Посмотреть, что в order.user
        // if (order.user) {
        //   console.log(`Order ID ${order.order_id} - User Object:`, JSON.parse(JSON.stringify(order.user)));
        // } else {
        //   console.log(`Order ID ${order.order_id} - User Object is MISSING or NULL`);
        // }

        return {
          id: order.order_id,
          editUrl: getAdminUrl(`/orders/edit/${order.order_id}`),
          items: [
            `#${order.order_id}`,
            userEmailText, // <--- Твой ебаный email
            order.status,
            formatDate(order.created_at),
            convertPrice(order.total_amount) 
          ],
        };
      });
    },
  });

  return { data, isFetching };
};