// src/features/teacher/teacherApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teacherApi = createApi({
    reducerPath: 'teacherApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/teacher',
        credentials: 'include',
    }),
    tagTypes: ['Classes'],
    endpoints: (builder) => ({
        
        // GET all classes of the teacher
        getClasses: builder.query({
            query: () => '/classes',
            providesTags: ['Classes'],
            transformResponse: (response) => response.classes,
        }),

        // Create class
        createClass: builder.mutation({
            query: (data) => ({
                url: '/classes',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Classes'],
        }),

        getSubmissions: builder.query({
            query: () => '/submissions',
        }),

        checkPractical: builder.mutation({
            query: ({ practicalId, data }) => ({
                url: `/submissions/${practicalId}`,
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const {
    useCreateClassMutation,
    useGetClassesQuery,
    useGetSubmissionsQuery,
    useCheckPracticalMutation,
} = teacherApi;

