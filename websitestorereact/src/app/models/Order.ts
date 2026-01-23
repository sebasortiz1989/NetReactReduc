export interface Root {
    id: number
    buyerEmail: string
    shippingAddress: ShippingAddress
    orderDate: string
    orderItems: OrderItem[]
    subtotal: number
    deliveryFee: number
    discount: number
    status: string
    paymentSummary: PaymentSummary
    total: number
}

export interface ShippingAddress {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
}

export interface OrderItem {
    productId: number
    name: string
    pictureUrl: string
    price: number
    quantity: number
}

export interface PaymentSummary {
    last4Digits: number
    cardBrand: string
    expiryMonth: number
    expiryYear: number
}

export interface CreateOrder {
    shippingAddress: ShippingAddress
    paymentSummary: PaymentSummary
}