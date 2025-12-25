import {createApi} from "@reduxjs/toolkit/query/react";
import type {Product} from "../../app/models/Product.ts";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";

export const catalogApi = createApi({
    reducerPath: '/catalog',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], void>({
            query: () => ({url: 'products'})
        }),
        fetchProductDetails: builder.query<Product, number>({
            query: (id: number) => ({url: `products/${id}`})
        }),
        fetchFilters: builder.query<{brands: string[], types: string[]}, void>({
            query: () => ({url: 'products/filters'})
        })
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery, useFetchFiltersQuery} = catalogApi;