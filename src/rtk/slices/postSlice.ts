

import { NewPost, Post, NewPostRequest, UpdatePostRequest, DeletePostRequest } from '@/models/post';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
    loading: boolean;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    newPost: Post | null;
    editedPost: Post | null;
    deletedPost: { msg: string } | null;
    redirect: string | null;
}

const initialState: PostState = {
    loading: false,
    createError: null,
    updateError: null,
    deleteError: null,
    redirect: null,
    editedPost: null,
    newPost: null,
    deletedPost: null
};

const  NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API as string;

export const createPost = createAsyncThunk(
    'post/new',
    async (postBody: NewPostRequest, { rejectWithValue }) => {
        try {
            const { token, ...body } = postBody;
            const response = await fetch(`${NEXT_PUBLIC_API}/api/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${token}`},
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Create Failed')

            return await response.json()
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
);

export const updatePost = createAsyncThunk(
    'post/update',
    async (putBody: UpdatePostRequest, { rejectWithValue }) => {
        try {
            const { token, _id, ...body } = putBody;
            const response = await fetch(`${NEXT_PUBLIC_API}/api/posts/${_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${token}`},
                body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Update Failed')

            return await response.json()
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
);

export const deletePost = createAsyncThunk(
    'post/delete',
    async (deleteBody: DeletePostRequest, { rejectWithValue }) => {
        try {
            const { token, _id } = deleteBody;
            const response = await fetch(`${NEXT_PUBLIC_API}/api/posts/${_id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' ,'Authorization': `Bearer ${token}`},
                //body: JSON.stringify(body)
            })
            if (!response.ok) throw new Error('Delete Failed')

            return await response.json()
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
);

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        clearNew: (state) => {
            state.newPost = null;
        },
        clearUpdated: (state) => {
            state.editedPost = null;
        },
        clearDeleted: (state) => {
            state.deletedPost = null;
        },
        clearErrors: (state) => {
            state.createError = null;
            state.deleteError = null;
            state.updateError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.loading = true
                state.createError = null
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<{ data: Post }>) => {
                state.loading = false
                state.createError = null;
                state.newPost = action.payload.data;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false
                state.createError = action.payload as string
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true
                state.updateError = null
            })
            .addCase(updatePost.fulfilled, (state, action: PayloadAction<{ data: Post }>) => {
                state.loading = false
                state.updateError = null;
                state.editedPost = action.payload.data;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false
                state.updateError = action.payload as string
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true
                state.deleteError = null
            })
            .addCase(deletePost.fulfilled, (state, action: PayloadAction<{ data: {msg: string} }>) => {
                state.loading = false
                state.deleteError = null;
                state.deletedPost = action.payload.data;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false
                state.deleteError = action.payload as string
            })
    }
})

export const { clearDeleted, clearNew, clearUpdated, clearErrors } = postSlice.actions;
export default postSlice.reducer;