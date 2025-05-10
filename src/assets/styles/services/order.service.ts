// @/src/assets/styles/services/order.service.ts
import { instanse } from '../api/api.interceptor';
import { IOrder } from '@/src/types/order.interface';
import { IOrderRequest } from './order.types';
import { AxiosResponse } from 'axios';
import { ICreateOrderResponse } from '@/src/types/order.interface'; // <--- ИМПОРТИРУЙТЕ ПРАВИЛЬНЫЙ ТИП ОТВЕТА

const ORDERS = 'orders';

export const OrderService = {
  async getAll() {
    return instanse<IOrder[]>({
      url: `/admin/orders/`,
      method: 'GET',
    });
  },

  async getByUserId(): Promise<AxiosResponse<IOrder[]>> {
    return instanse<IOrder[]>({ 
      url: `${ORDERS}`,
      method: 'GET',
    });
  },

  // ИСПРАВЛЕНО ЗДЕСЬ:
  async createOrder(data: IOrderRequest): Promise<AxiosResponse<ICreateOrderResponse>> {
    // Теперь instanse типизирован с ICreateOrderResponse.
    // Это означает, что поле `data` в AxiosResponse будет иметь тип ICreateOrderResponse.
    return instanse<ICreateOrderResponse>({ 
      url: ORDERS,
      method: 'POST',
      data,
    });
  },

  async cancelOrder(orderId: number) {
    return instanse<{ message: string; order_id: number; new_status: string }>({
      url: `${ORDERS}/${orderId}/cancel`,
      method: 'POST',
    });
  },
};