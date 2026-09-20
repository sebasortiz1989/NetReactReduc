import {useClearBasketMutation, useFetchBasketQuery} from "../../features/basket/basketApi.ts";

export const useBasket = () => {
    const {data: basket} = useFetchBasketQuery();
    const [clearBasket] = useClearBasketMutation();
    
    if (!basket || basket.items.length === 0) return {basket: null, subtotal: 0, deliveryFee: 0};
    const subtotal = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Must match the server rule (OrdersController / PaymentsService): $5.00 under $100.
    const deliveryFee = subtotal > 100 * 100 ? 0 : 500;
    const total = subtotal + deliveryFee;
    return {basket, subtotal, deliveryFee, total, clearBasket};
}