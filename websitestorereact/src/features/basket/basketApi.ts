import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {Basket} from "../../app/models/Basket.ts";

export const basketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket,  void>({
            query: () => 'basket',
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