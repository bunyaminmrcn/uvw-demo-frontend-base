

import { Author } from '@/models/author';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import Cookie from 'js-cookie';
interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    redirect: string | null;
    user: Author | null;
    setOK: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true,
    token: null,
    isAuthenticated: false,
    error: null,
    redirect: null,
    setOK: false
};

const  NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API as string;

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${NEXT_PUBLIC_API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
                credentials: 'include', // This is important for cookies
            })
            if (!response.ok) throw new Error('Login failed')

            return await response.json()
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)


export const register = createAsyncThunk(
    'auth/register',
    async (credentials: { username: string; password: string, password_again: string, name: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${NEXT_PUBLIC_API}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            })
            if (!response.ok) throw new Error('Register failed')
            return await response.json()
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)


export const logout = createAsyncThunk(
    'auth/logout',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${NEXT_PUBLIC_API}/api/users/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            })
            if (!response.ok) throw new Error('Logout failed')
            return await response.json();
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ data: {user: Author | null} }>) => {
            if (action.payload.data.user) {
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
            }
        },
        setToken: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            console.log({ setToken: action.payload.token || '' })
        },
        logoutStore: (state) => {
            state.isAuthenticated = false
            state.token = null
            localStorage.removeItem('token')
        },
        setAuthOp: (state) => {
            state.setOK = true;
            state.redirect = null
        },
        resetRedirect: (state) => {
            state.redirect = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ data: { token: string } }>) => {
                state.isAuthenticated = true
                localStorage.setItem('token', action.payload.data.token);
                //console.log("Local token is set")
                state.token = action.payload.data.token;
                state.loading = false
                state.redirect = "/dashboard"
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            }).addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<{ data: { redirect: string } }>) => {
                //state.isAuthenticated = true
                state.redirect = action.payload.data.redirect;
                state.loading = false
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(logout.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logout.fulfilled, (state, action: PayloadAction<{ data: { redirect: string } }>) => {
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                state.token = null
                state.user = null;
                state.setOK = false;
                state.redirect = '/auth/login';
                Cookie.remove('token', { path: '/', httpOnly: true , domain: 'localhost', secure: true, sameSite: 'strict'})
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
});

export const { logoutStore, setAuth, setToken, setAuthOp,resetRedirect } = authSlice.actions;
export default authSlice.reducer;