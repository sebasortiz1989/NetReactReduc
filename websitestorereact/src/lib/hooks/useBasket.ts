import {useClearBasketMutation, useFetchBasketQuery} from "../../features/basket/basketApi.ts";

export const useBasket = () => {
    const {data: basket} = useFetchBasketQuery();
    const [clearBasket] = useClearBasketMutation();
    
    if (!basket || basket.items.length === 0) return {basket: null, subtotal: 0, deliveryFee: 0};
    const subtotal = basket.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 100 * 100 ? 0 : 5.99 * 100;
    const total = subtotal + deliveryFee;
    return {basket, subtotal, deliveryFee, total, clearBasket};
}