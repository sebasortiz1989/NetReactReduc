import {createApi} from "@reduxjs/toolkit/query/react";
import type {Product} from "../../app/models/Product.ts";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {ProductParams} from "../../app/models/productParams.ts";
import {filterEmptyValues} from "../../lib/util.ts";

export const catalogApi = createApi({
    reducerPath: '/catalog',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        fetchProducts: builder.query<Product[], ProductParams>({
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            }
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