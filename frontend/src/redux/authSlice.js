import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import instance from '../api/axios'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')),
    loading: false,
    error: null
}

export const userRegisterThunk = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/user/register', userData);
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userLoginThunk = createAsyncThunk(
    'user/login',
    async (loginData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/user/login', loginData, {
                withCredentials: true
            })
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userLogoutThunk = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/user/logout', _, {
                withCredentials: true
            })
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message });
        }
    }
)

export const userProfileUpdateThunk = createAsyncThunk(
    'user/profile/update',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await instance.put('/user/profile', userData, {
                withCredentials: true,
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const changePasswordThunk = createAsyncThunk(
    'user/change-password',
    async (passwordData, { rejectWithValue }) => {
        try {
            const { data } = await instance.put('/user/change-password', passwordData, {
                withCredentials: true,
            })
            return data
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(userRegisterThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userRegisterThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(userRegisterThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            .addCase(userLoginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLoginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))
            })
            .addCase(userLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            .addCase(userLogoutThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogoutThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.setItem('user', JSON.stringify(state.user))
                localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated))
            })
            .addCase(userLogoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            .addCase(userProfileUpdateThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(userProfileUpdateThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.user = action.payload.user
                localStorage.setItem('user', JSON.stringify(state.user))

            })
            .addCase(userProfileUpdateThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })


    }
})

export const { setUser } = authSlice.actions;

export default authSlice.reducer;