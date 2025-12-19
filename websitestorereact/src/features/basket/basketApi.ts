import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {Basket} from "../../app/models/Basket.ts";

type ServerBasket = {
    id: string
    items: Array<{
        productId?: number
        name: string
        price?: number
        quantity?: number
    }>
}

export const basketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => ({ url: 'basket', method: 'GET' }),
            transformResponse: (response: ServerBasket): Basket => {
                return {
                    basketId: response.id,
                    items: response.items,
                } as Basket
            },
        }),
        addItemToBasket: builder.mutation<Basket, {productId: number, quantity?: number}>({
            query: ({productId, quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'POST',
            }),
        }),
        removeItemFromBasket: builder.mutation<void, {productId: number, quantity: number}>({
            query: ({productId, quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useFetchBasketQuery,
    useAddItemToBasketMutation,
    useRemoveItemFromBasketMutation
} = basketApi;