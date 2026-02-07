// src/features/admin/adminApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseAPI.ts";
import type { CreateProductSchema } from "../../lib/schemas/createProductSchema.ts";
import type { Product } from "../../app/models/Product.ts";

export const adminApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        createProduct: builder.mutation<Product, CreateProductSchema>({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: data,
                formData: true,
            }),
        }),
        updateProduct: builder.mutation<Product, { id: number; data: CreateProductSchema }>({
            query: ({ id, data }) => ({
                url: `products/${id}`,
                method: "PUT",
                body: data,
                formData: true,
            }),
        }),
    }),
});

export const { useCreateProductMutation, useUpdateProductMutation } = adminApi;
