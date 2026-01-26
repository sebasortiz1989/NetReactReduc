import type {PaymentSummary, ShippingAddress} from "../app/models/Order.ts";

export function shippingAddressFormat(address: ShippingAddress): string {
    if (!address) return '';
    return `${address?.name}, ${address?.line1}, ${address?.line2 ? address?.line2 + ', ' : ''}${address?.city}, ${address?.state ? address?.state + ', ' : ''}${address?.postal_code}, ${address?.country}`;
}

export function cardInfoFormat(paymentSummary: PaymentSummary): string {
    if (!paymentSummary) return '';
    return `${paymentSummary.brand?.toLocaleUpperCase()}, **** **** **** ${paymentSummary.last4}, exp: ${paymentSummary.exp_month}/${paymentSummary.exp_year}`;
}

export function currencyFormat(amount: number, currency = 'USD', locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount / 100);
}

export function filterEmptyValues(values: Record<string, unknown>) {
    return Object.fromEntries(
        Object.entries(values).filter(([, value]) => {
            if (value === undefined || value === null) return false;
            if (typeof value === 'string') return value.trim() !== '';
            if (Array.isArray(value)) return value.length > 0;
            return true; // keep numbers/booleans/objects
        })
    );
}