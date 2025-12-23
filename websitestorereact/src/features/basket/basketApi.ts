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
        fetchBasket: builder.query<Basket | null, void>({
            query: () => ({ url: 'basket', method: 'GET' }),
            transformResponse: (response: ServerBasket | null): Basket | null => {
                if (!response) return null;
                return {
                    basketId: response.id,
                    items: response.items,
                } as Basket;
            },
            providesTags: ['Basket'],
        }),
        addItemToBasket: builder.mutation<Basket, {product: Product, quantity?: number}>({
            query: ({product, quantity}) => ({
                url: `basket?productId=${product.id}&quantity=${quantity}`,
                method: 'POST',
            }),
            onQueryStarted: async ({product, quantity}, { dispatch, queryFulfilled }) => {
                let isNewBasket = false;
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        if (!draft) {
                            isNewBasket = true;
                            return;
                        }
                        const item = draft.items.find(i => i.productId === product.id);

                        if (!draft.basketId)
                            isNewBasket = true;

                        if (!isNewBasket)
                        {
                            if (item) {
                                item.quantity += quantity ?? 1;
                            } else {
                                draft.items.push({...product, productId: product.id, quantity: quantity ?? 1} as Item);
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                    if (isNewBasket)
                        dispatch(basketApi.util.invalidateTags(['Basket']));

                } catch {
                    patchResult.undo();
                }
            },
        }),
        addItemToBasketById: builder.mutation<Basket, {productId: number, quantity?: number}>({
            query: ({productId, quantity}) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'POST',
            }),
            onQueryStarted: async ({productId, quantity}, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        if (!draft) return;
                        const item = draft.items.find(i => i.productId === productId);
                        if (item) {
                            item.quantity += quantity ?? 1;
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
            onQueryStarted: async ({productId, quantity}, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        if (!draft) return;
                        const itemIndex = draft.items.findIndex(i => i.productId === productId);
                        if (itemIndex >= 0) {
                            const item = draft.items[itemIndex];
                            item.quantity -= quantity;
                            if (item.quantity <= 0) {
                                draft.items.splice(itemIndex, 1);
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error)
                    patchResult.undo();
                }
            },
        }),
    }),
});

export const {
    useFetchBasketQuery,
    useAddItemToBasketMutation,
    useAddItemToBasketByIdMutation,
    useRemoveItemFromBasketMutation
} = basketApi;