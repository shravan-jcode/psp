// src/features/teacher/teacherSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    classes: [],
    submissions: [],
    loading: false,
    error: null,
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        setClasses: (state, action) => {
            state.classes = action.payload;
        },
        setSubmissions: (state, action) => {
            state.submissions = action.payload;
        },
    },
});

export const { setClasses, setSubmissions } = teacherSlice.actions;
export default teacherSlice.reducer;
