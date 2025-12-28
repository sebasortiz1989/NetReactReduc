import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {User} from "../../app/models/User.ts";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        login: builder.mutation<void, object>({
            query: (credentials) => {
                return {
                    url: 'account/login',
                    method: 'POST',
                    body: credentials
                }
            }
        }),
        register: builder.mutation<void, object>({
            query: (registrationData) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: registrationData
                }
            }
        }),
        userInfo: builder.query<User, void>({
            query: () => 'account/user-info'
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            })
        })
    })
});

export const {useLoginMutation, useRegisterMutation, useUserInfoQuery, useLogoutMutation} = accountApi;