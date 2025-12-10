import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {Product} from "../../app/models/Product.ts";
import {baseUrl} from "../BaseUrl.ts";

export const catalogApi = createApi({
    reducerPath: '/catalog',
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void>({
            query: () => ({url: 'products'})
        }),
        fetchProductDetails: builder.query<Product, number>({
            query: (id: number) => ({url: `products/${id}`})
        })
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery} = catalogApi;