import type {PaymentSummary, ShippingAddress} from "../app/models/Order.ts";
import type {FieldValues, Path, UseFormSetError} from "react-hook-form";

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

export function handleApiError<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    fieldNames: Path<T>[]
) {
    const apiError = error as { message: string } || {};
    if (apiError.message && typeof apiError.message === 'string') {
        const errorArray = apiError.message.split(',');
        errorArray.forEach((error) => {
            const matchedField = fieldNames.find(
                (fieldName) => error.toLowerCase().includes(fieldName.toString().toLowerCase()));
            
            if (matchedField) {
                setError(matchedField, {message: error.trim()});
            }
        })
    }
}