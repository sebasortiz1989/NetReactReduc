import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {Order} from "@stripe/stripe-js";
import type {CreateOrder} from "../../app/models/Order.ts";

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchOrders: builder.query<Order[], void>({
            query: () => 'orders',
        }),
        fetchOrderDetailed: builder.query<Order, number>({
            query: (orderId) => ({ url: `orders/${orderId}` }),
        }),
        createOrder: builder.query<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order,
            }),
        })
    })
})

export const {useFetchOrdersQuery, useFetchOrderDetailedQuery, useCreateOrderQuery} = orderApi;