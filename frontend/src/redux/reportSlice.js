import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../api/axios";

const initialState = {
    reports: [],
    loading: false,
    error: null
}

export const reportBlogThunk = createAsyncThunk(
    'report/submit',
    async (reportData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/report/submit', reportData, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getAllReportsThunk = createAsyncThunk(
    'report/all',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/report/all', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const resolveReportThunk = createAsyncThunk(
    'report/resolve',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/report/resolve/${id}`, null, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

const reportSlice = createSlice({
    name: 'reportSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(reportBlogThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(reportBlogThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null
            })
            .addCase(reportBlogThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload.message
            })

            .addCase(getAllReportsThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAllReportsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.reports = action.payload.reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            })
            .addCase(getAllReportsThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload.message
            })

            .addCase(resolveReportThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(resolveReportThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const reportIndex = state.reports.findIndex((r) => r._id === action.payload.report._id)
                if (reportIndex !== -1) {
                    state.reports[reportIndex] = action.payload.report
                }
            })
            .addCase(resolveReportThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload.message
            })
    }
})

export default reportSlice.reducer;