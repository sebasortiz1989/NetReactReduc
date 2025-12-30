import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseAPI.ts";
import type {User} from "../../app/models/User.ts";
import type {LoginSchema} from "../../lib/schemas/loginSchema.ts";
import {router} from "../../app/routes/Routes.tsx";
import {toast} from "react-toastify";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginSchema>({
            query: (credentials) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: credentials
                }
            },
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(accountApi.util.invalidateTags(['UserInfo']));
                } catch(error) {
                    console.log(error)
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
            },
            async onQueryStarted(_, {queryFulfilled}) {
                try {
                    await queryFulfilled;
                    toast.success('Registration successful - you can now login');
                    await router.navigate('/login');
                } catch(error) {
                    console.log(error)
                }
            }
        }),
        userInfo: builder.query<User, void>({
            query: () => 'account/user-info',
            providesTags: ['UserInfo']
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(accountApi.util.invalidateTags(['UserInfo']));
                    await router.navigate('/');
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
});

export const {useLoginMutation, useRegisterMutation, useUserInfoQuery, useLogoutMutation} = accountApi;