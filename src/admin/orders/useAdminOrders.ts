import { OrderService } from '@/src/assets/styles/services/order.service';
import { IListItem } from '@/src/components/ui/admin/admin-list/admin-list.interface';
import { getAdminUrl } from '@/src/config/url.config';
import { convertPrice } from '@/src/utils/convertPrice';
import { formatDate } from '@/src/utils/format-date';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAdminOrders = () => {
  const { data = [], isFetching, refetch } = useQuery({
    queryKey: ['get admin orders'],
    queryFn: () => OrderService.getAll(),
    select: ({ data }) =>
      data.map((order): IListItem => ({
        id: order.order_id,
        editUrl: getAdminUrl(`/orders/edit/${order.order_id}`),
        items: [
          `#${order.order_id}`,
          order.status,
          formatDate(order.created_at),
          convertPrice(order.total_amount) 
        ],
      })),
  });



  return { data, isFetching };
};
