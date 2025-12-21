import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import {type Basket, Item} from "../../app/models/Basket.ts";
import type {Product} from "../../app/models/Product.ts";

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
    tagTypes : ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => ({ url: 'basket', method: 'GET' }),
            transformResponse: (response: ServerBasket): Basket => {
                return {
                    basketId: response.id,
                    items: response.items,
                } as Basket
            },
            providesTags: ['Basket'],
        }),
        addItemToBasket: builder.mutation<Basket, {product: Product, quantity?: number}>({
            query: ({product, quantity}) => ({
                url: `basket?productId=${product.id}&quantity=${quantity}`,
                method: 'POST',
            }),
            onQueryStarted: async ({product, quantity}, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        const item = draft.items.find(i => i.productId === product.id);
                        if (item) {
                            item.quantity += quantity ?? 1;
                        } else {
                            draft.items.push(new Item(product, quantity ?? 1));
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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