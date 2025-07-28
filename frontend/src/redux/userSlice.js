import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import instance from "../api/axios"

const initialState = {
    users: [],
    loading: false,
    error: null
}

export const followUserThunk = createAsyncThunk(
    'user/follow',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/user/follow/${id}`, null, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const unFollowUserThunk = createAsyncThunk(
    'user/unfollow',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/user/unfollow/${id}`, null, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const userRoleUpdateThunk = createAsyncThunk(
    'user/role-update',
    async (roleData, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/user/role-update/${roleData.id}`, roleData, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getUserByIdThunk = createAsyncThunk(
    'user/profile',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.get(`/user/profile/${id}`)
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const generatePasswordResetOtpThunk = createAsyncThunk(
    'user/reset-password/generate-otp',
    async (email, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/user/reset-password/generate-otp', email)
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const confirmPasswordResetThunk = createAsyncThunk(
    'user/reset-password/confirm',
    async (resetData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/user/reset-password/confirm', resetData)
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getAllUsersThunk = createAsyncThunk(
    'user/all',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/user/all-users', { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const deleteUserThunk = createAsyncThunk(
    'user/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.delete(`/user/${id}`, { withCredentials: true })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(followUserThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(followUserThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(followUserThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(unFollowUserThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(unFollowUserThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(unFollowUserThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(getUserByIdThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserByIdThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(getUserByIdThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(generatePasswordResetOtpThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(generatePasswordResetOtpThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(generatePasswordResetOtpThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(confirmPasswordResetThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(confirmPasswordResetThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(confirmPasswordResetThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(getAllUsersThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllUsersThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.users = action.payload.users
            })
            .addCase(getAllUsersThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(userRoleUpdateThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(userRoleUpdateThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(userRoleUpdateThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(deleteUserThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteUserThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.users = state.users.filter((u) => u._id !== action.payload.user._id)
            })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })
    }
})

export default userSlice.reducer;