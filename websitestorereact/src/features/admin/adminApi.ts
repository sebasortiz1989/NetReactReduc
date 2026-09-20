import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseAPI.ts";
import type { Product } from "../../app/models/Product.ts";

export const adminApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        createProduct: builder.mutation<Product, FormData>({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: data,
                formData: true,
            }),
        }),
        updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
            query: ({ id, data }) => {
                data.append('id', id.toString());
                return {
                    url: `products/${id}`,
                    method: "PUT",
                    body: data,
                    formData: true,
                }
            },
        }),
    }),
});

export const { useCreateProductMutation, useUpdateProductMutation } = adminApi;
