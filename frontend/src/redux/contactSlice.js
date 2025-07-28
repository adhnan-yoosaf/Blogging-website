import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../api/axios";

const initialState = {
    contactMsgs: [],
    loading: false,
    error: null
}

export const sendContactMsgThunk = createAsyncThunk(
    'contact/send',
    async (contact, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/contact/send', contact, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getAllContactMsgThunk = createAsyncThunk(
    'contact/all',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/contact/all', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const markContactMsgAsReadThunk = createAsyncThunk(
    'contact/mark-as-read',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/contact/mark-as-read/${id}`, null, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const sendReplyThunk = createAsyncThunk(
    'contact/reply',
    async (replyData, { rejectWithValue }) => {
        try {
            const { data } = await instance.post(`/contact/reply/${replyData.id}`, replyData, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

const contactSlice = createSlice({
    name: 'contactSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendContactMsgThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(sendContactMsgThunk.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(sendContactMsgThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(getAllContactMsgThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllContactMsgThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.contactMsgs = action.payload.contactMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            })
            .addCase(getAllContactMsgThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(markContactMsgAsReadThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(markContactMsgAsReadThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                const contactIndex = state.contactMsgs.findIndex((c) => c._id === action.payload.contact._id);
                if (contactIndex !== -1) {
                    state.contactMsgs[contactIndex] = action.payload.contact
                }
            })
            .addCase(markContactMsgAsReadThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })

            .addCase(sendReplyThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(sendReplyThunk.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                const contactIndex = state.contactMsgs.findIndex((c) => c._id === action.payload.contact._id);
                if (contactIndex !== -1) {
                    state.contactMsgs[contactIndex].isReplied = true;
                }
            })
            .addCase(sendReplyThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message
            })
    }
})


export default contactSlice.reducer;