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
        // The API exposes PUT on api/products (no {id} segment) and reads the id
        // from the body, so the id goes in the form data rather than the URL.
        updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
            query: ({ id, data }) => {
                data.set('id', id.toString());
                return {
                    url: "products",
                    method: "PUT",
                    body: data,
                    formData: true,
                }
            },
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `products/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = adminApi;
