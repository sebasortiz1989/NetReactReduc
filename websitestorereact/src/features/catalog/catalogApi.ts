import {createApi} from "@reduxjs/toolkit/query/react";
import type {Product} from "../../app/models/Product.ts";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {ProductParams} from "../../app/models/productParams.ts";
import {filterEmptyValues} from "../../lib/util.ts";
import type {Pagination} from "../../app/models/pagination.ts";

export const catalogApi = createApi({
    reducerPath: 'catalog',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<{ items: Product[], pagination: Pagination | null }, ProductParams>({
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            },
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? (JSON.parse(paginationHeader) as Pagination) : null;
                return {items, pagination};
            },
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
