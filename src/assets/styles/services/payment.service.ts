import { IPaymentResponse } from '@/src/types/payment.intefrace';
import { instanse } from '../api/api.interceptor';


const PAYMENT = 'payment'

export const PaymentService = {
    async createPayment(amount: number) {
       return instanse.post<IPaymentResponse> (PAYMENT, {
         amount
      })
     }
 }


