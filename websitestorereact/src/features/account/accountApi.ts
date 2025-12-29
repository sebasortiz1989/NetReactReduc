import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {User} from "../../app/models/User.ts";
import type {LoginSchema} from "../../lib/schemas/loginSchema.ts";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginSchema>({
            query: (credentials) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: credentials
                }
            }
        }),
        register: builder.mutation<void, object>({
            query: (registrationData) => {
                return {
                    url: 'register',
                    method: 'POST',
                    body: registrationData
                }
            }
        }),
        userInfo: builder.query<User, void>({
            query: () => 'user-info'
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'logout',
                method: 'POST'
            })
        })
    })
});

export const {useLoginMutation, useRegisterMutation, useUserInfoQuery, useLogoutMutation} = accountApi;