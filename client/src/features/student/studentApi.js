import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/student',
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        joinClass: builder.mutation({
            query: (classCode) => ({
                url: '/join-class',
                method: 'POST',
                body: { classCode },
            }),
        }),
        uploadPractical: builder.mutation({
            query: ({ classId, formData }) => ({
                url: `/upload-practical/${classId}`,
                method: 'POST',
                body: formData,
            }),
        }),
        getPracticals: builder.query({
            query: () => '/practicals',
        }),
        getMySubjects: builder.query({
    query: () => '/my-subjects',
}),
getClassById: builder.query({
    query: (classId) => `/class/${classId}`,
}),

    }),
});

export const {
    useJoinClassMutation,
    useUploadPracticalMutation,
    useGetPracticalsQuery,
    useGetMySubjectsQuery,
    useGetClassByIdQuery,
} = studentApi;
