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
    getClasses: builder.query({
      query: () => '/classes',
      providesTags: ['Classes'],
      transformResponse: (response) => response.classes,
    }),

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

    // ✅ NEW: Fetch single submission
    getSubmissionById: builder.query({
      query: (id) => `/submissions/${id}`,
    }),

    checkPractical: builder.mutation({
      query: ({ practicalId, data }) => ({
        url: `/submissions/${practicalId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getApprovedSubmissions: builder.query({
  query: () => '/approved-submissions',
}),

  }),
});

export const {
  useCreateClassMutation,
  useGetClassesQuery,
  useGetSubmissionsQuery,
  useGetSubmissionByIdQuery, // ✅ export this
  useCheckPracticalMutation,
  useGetApprovedSubmissionsQuery,
} = teacherApi;
