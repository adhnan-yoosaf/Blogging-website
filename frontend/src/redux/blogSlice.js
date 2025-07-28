import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from '../api/axios';

const initialState = {
    blogs: [],
    blog: null,
    loading: false,
    error: null
}

export const getAllBlogsThunk = createAsyncThunk(
    'blog/all',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/blog/all');
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const createBlogThunk = createAsyncThunk(
    'blog/create',
    async (blog, { rejectWithValue }) => {
        try {
            const { data } = await instance.post('/blog/create', blog, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getBlogByIdThunk = createAsyncThunk(
    'blog/getBlogById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.get(`/blog/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const blogLikeThunk = createAsyncThunk(
    'blog/like',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/blog/${id}/like`, null, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const blogDislikeThunk = createAsyncThunk(
    'blog/dislike',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/blog/${id}/dislike`, null, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const bookmarkBlogThunk = createAsyncThunk(
    'blog/bookmark',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.post(`/blog/${id}/bookmark`, null, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const addCommentThunk = createAsyncThunk(
    'blog/comment',
    async ({ content, id }, { rejectWithValue }) => {
        try {
            const { data } = await instance.post(`/blog/${id}/comment`, content, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const deleteCommentThunk = createAsyncThunk(
    'blog/comment/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.delete(`/blog/comment/${id}`, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const editCommentThunk = createAsyncThunk(
    'blog/comment/edit',
    async ({ blogId, commentId, content }, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/blog/${blogId}/comment/edit/${commentId}`, content, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getBlogsByCategoryThunk = createAsyncThunk(
    'blog/category',
    async (category, { rejectWithValue }) => {
        try {
            const { data } = await instance.get(`/blog/categories/${category}`);
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getBlogsByUserThunk = createAsyncThunk(
    'blog/user/blogs',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.get(`/blog/user/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const editBlogThunk = createAsyncThunk(
    'blog/edit',
    async (blog, { rejectWithValue }) => {
        try {
            const { data } = await instance.put(`/blog/${blog._id}`, blog, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const deleteBlogThunk = createAsyncThunk(
    'blog/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await instance.delete(`/blog/${id}`, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

export const getBookmarkedBlogsThunk = createAsyncThunk(
    'blog/bookmarks',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await instance.get('/blog/bookmarks', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue({ message: error?.response?.data?.message || error?.message })
        }
    }
)

const blogSlice = createSlice({
    name: 'blogSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlogsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBlogsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blogs = action.payload.blogs;
            })
            .addCase(getAllBlogsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(createBlogThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBlogThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blogs.push(action.payload.blog);
            })
            .addCase(createBlogThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(getBlogByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBlogByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blog = action.payload.blog
            })
            .addCase(getBlogByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(blogLikeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(blogLikeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blog = action.payload.blog;
            })
            .addCase(blogLikeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(blogDislikeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(blogDislikeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blog = action.payload.blog;
            })
            .addCase(blogDislikeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(bookmarkBlogThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bookmarkBlogThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(bookmarkBlogThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(addCommentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCommentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blog = action.payload.blog;
            })
            .addCase(addCommentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(deleteCommentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCommentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blog = action.payload.blog;
            })
            .addCase(deleteCommentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(editCommentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editCommentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blog = action.payload.blog;
            })
            .addCase(editCommentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(getBlogsByCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBlogsByCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blogs = action.payload.blogs;
            })
            .addCase(getBlogsByCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(getBlogsByUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBlogsByUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blogs = action.payload.blogs;
            })
            .addCase(getBlogsByUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(editBlogThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editBlogThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(editBlogThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(deleteBlogThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlogThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blogs = state.blogs.filter((blog) => blog._id !== action.payload.blog._id)
            })
            .addCase(deleteBlogThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })

            .addCase(getBookmarkedBlogsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookmarkedBlogsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.blogs = action.payload.bookmarks
            })
            .addCase(getBookmarkedBlogsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message
            })
    }
})

export default blogSlice.reducer;