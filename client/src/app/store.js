// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';

import { studentApi } from '../features/student/studentApi';
import studentReducer from '../features/student/studentSlice';

import { teacherApi } from '../features/teacher/teacherApi';
import teacherReducer from '../features/teacher/teacherSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        teacher: teacherReducer,

        [authApi.reducerPath]: authApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [teacherApi.reducerPath]: teacherApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            studentApi.middleware,
            teacherApi.middleware
        ),
});
