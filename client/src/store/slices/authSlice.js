import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const user = JSON.parse(localStorage.getItem('user')) || null;
const token = localStorage.getItem('token') || null;

const initialState = {
    user: user,
    token: token,
    isAuthenticated: !!token,
    isLoading: false,
    isUpdating: false,
    error: null,
};
export const signin = createAsyncThunk(
    'auth/signin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/users/signin', credentials);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            localStorage.setItem('token', response.data.data.token);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Sign-in failed');
        }
    }
);
export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/users/signup', userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Sign-up failed');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/users/profile/${userId}`, userData);
            const updatedUser = response.data.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            // Prefer detailed validation messages when provided by backend
            const apiData = error.response?.data;
            const detailed = Array.isArray(apiData?.errors) && apiData.errors.length > 0
                ? apiData.errors.map(e => e.message).join(', ')
                : apiData?.message;
            return rejectWithValue(detailed || 'Profile update failed');
        }
    }
);


// --- Auth Slice ---

const authSlice = createSlice({
    name: 'auth',
    initialState,
    // Synchronous reducers
    reducers: {
        logout: (state) => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    // Asynchronous reducers (handles thunks)
    extraReducers: (builder) => {
        builder
            // --- Sign-in Cases ---
            .addCase(signin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(signin.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })

            // --- Sign-up Cases ---
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // --- Update Profile Cases ---
            .addCase(updateUserProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.user = action.payload; // Update state with the new user object
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            });
    },
});

// Export synchronous actions
export const { logout, clearAuthError } = authSlice.actions;

// Export selectors for easy access in components
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.isAdmin || false;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsUpdatingUser = (state) => state.auth.isUpdating; // New selector

// Export the reducer as default
export default authSlice.reducer;