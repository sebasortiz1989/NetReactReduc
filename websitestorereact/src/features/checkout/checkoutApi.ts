import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {Basket} from "../../app/models/Basket.ts";
import {basketApi} from "../basket/basketApi.ts";

export const checkoutApi = createApi({
    reducerPath: 'checkoutApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation<Basket, void>({
            query: () => ({
                url: 'payments',
                method: 'POST',
            }),
            onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(
                        basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                            if (!draft) return;
                            draft.clientSecret = data.clientSecret;
                        })
                    );
                } catch (error) {
                    console.log('Payment Intent creation failed:', error);
                }
            },
        }),
    })
});

export const {useCreatePaymentIntentMutation} = checkoutApi;
