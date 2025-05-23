import { StringDecoder } from "string_decoder"

interface Amount {
    value: string
    currency: string
}

interface Recipient {
    account_id: string
    gateway_id: string
}

interface PaymentMethod {
    type: string
    id: string
    saved: boolean
}

interface Confirmation {
    type: string
    return_url: string
    confirmation_url: string
}

export interface IPaymentResponse {
    id: string
    status: string
    amount: Amount
    recipent: Recipient
    payment_method: PaymentMethod
    created_at: Date
    confirmation : Confirmation
}