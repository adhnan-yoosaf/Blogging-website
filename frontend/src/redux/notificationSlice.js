import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../api/axios";

const initialState = {
    notifications: [],
    loading: false,
    error: null
}

export const getUnreadNotificationCountThunk = createAsyncThunk(
    'notification/unread-count',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/notification/unread-count', { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getAllNotificationsThunk = createAsyncThunk(
    'notification/all',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/notification/all', { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const markNotificationAsReadThunk = createAsyncThunk(
    'notification/mark-as-read',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/notification/${id}/mark-as-read`, null, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const markAllNotificationAsReadThunk = createAsyncThunk(
    'notification/mark-as-read/all',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/notification/mark-as-read/all`, null, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUnreadNotificationCountThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUnreadNotificationCountThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(getUnreadNotificationCountThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(getAllNotificationsThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllNotificationsThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.notifications = action.payload.notifications
                state.notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            })
            .addCase(getAllNotificationsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(markNotificationAsReadThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(markNotificationAsReadThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                const notifIndex = state.notifications.findIndex((n) => n._id === action.payload.notification._id)
                if (notifIndex !== -1) {
                    state.notifications[notifIndex] = action.payload.notification;
                }
            })
            .addCase(markNotificationAsReadThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(markAllNotificationAsReadThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(markAllNotificationAsReadThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.notifications.forEach((notif) => notif.isRead = true)
            })
            .addCase(markAllNotificationAsReadThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })
    }
})

export default notificationSlice.reducer;