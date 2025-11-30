// src/features/auth/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/auth',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (userData) => ({
                url: '/signup',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        getMe: builder.query({
    query: () => ({
        url: "/me",
        method: "GET",
    }),
}),

    }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation,useGetMeQuery } = authApi;
