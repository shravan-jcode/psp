import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    classes: [],
    practicals: [],
    loading: false,
    error: null,
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setClasses: (state, action) => {
            state.classes = action.payload;
        },
        setPracticals: (state, action) => {
            state.practicals = action.payload;
        },
    },
});

export const { setClasses, setPracticals } = studentSlice.actions;
export default studentSlice.reducer;
