import { instanse } from '../api/api.interceptor';
import { IOrder } from '@/src/types/order.intefrace';
import { IOrderRequest } from './order.types';

const ORDERS = 'orders';

export const OrderService = {
  async getAll() {
    return instanse<IOrder[]>({
      url: '/admin/orders/', // Обновите путь
      method: 'GET',
    });
  },

  async getByUserId() {
    return instanse<IOrder[]>({
      url: `${ORDERS}`,
      method: 'GET'
    })
  },


  async createOrder(data: IOrderRequest) {
    return instanse<{ url: string }>({
      url: ORDERS,
      method: 'POST',
      data,
    });
  },
};
