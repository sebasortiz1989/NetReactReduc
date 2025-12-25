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