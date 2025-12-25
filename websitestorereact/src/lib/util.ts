export function currencyFormat(amount: number, currency = 'USD', locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount / 100);
}

export function filterEmptyValues(values: object) {
    return Object.fromEntries(
        Object.entries(values).filter(([, value]) =>
            (value as string[]).length > 0 && value !== undefined && value !== null && value !== ''
        )
    );
}