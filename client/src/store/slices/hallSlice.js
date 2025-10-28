import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    halls: [],
    currentHall: null,
    isLoading: false,
    error: null,
    deletingHallId: null, // Track which hall is being deleted for per-card loading
};

// --- Async Thunks ---

/**
 * Async thunk to fetch all halls.
 * API: GET /api/halls/all
 */
export const fetchAllHalls = createAsyncThunk(
    'halls/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/halls/all');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch halls');
        }
    }
);

/**
 * Async thunk to fetch a single hall by its ID.
 * API: GET /api/halls/:id
 */
export const fetchHallById = createAsyncThunk(
    'halls/fetchById',
    async (hallId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/halls/${hallId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch hall');
        }
    }
);

/**
 * Async thunk to create a new hall (Admin only).
 * API: POST /api/halls/create
 */
export const createHall = createAsyncThunk(
    'halls/create',
    async (hallData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/halls/create', hallData);
            return response.data.data.hall;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create hall');
        }
    }
);

/**
 * Async thunk to update a hall (Admin only).
 * API: PUT /api/halls/:id/update
 */
export const updateHall = createAsyncThunk(
    'halls/update',
    async ({ hallId, hallData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/halls/${hallId}/update`, hallData);
            return response.data.data.hall;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update hall');
        }
    }
);

/**
 * Async thunk to delete a hall (Admin only).
 * API: DELETE /api/halls/:id/delete
 */
export const deleteHall = createAsyncThunk(
    'halls/delete',
    async (hallId, { rejectWithValue }) => {
        try {
            // API call based on your Notes.md
            await axiosInstance.delete(`/halls/${hallId}/delete`);
            return hallId; // Return the ID of the deleted hall
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete hall');
        }
    }
);

// --- Hall Slice ---

const hallSlice = createSlice({
    name: 'halls',
    initialState,
    reducers: {
        clearHallError: (state) => {
            state.error = null;
        },
        clearCurrentHall: (state) => {
            state.currentHall = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch All Halls Cases ---
            .addCase(fetchAllHalls.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllHalls.fulfilled, (state, action) => {
                state.isLoading = false;
                state.halls = action.payload.halls || action.payload;
            })
            .addCase(fetchAllHalls.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // --- Fetch Hall By ID Cases ---
            .addCase(fetchHallById.pending, (state) => {
                state.isLoading = true;
                state.currentHall = null;
                state.error = null;
            })
            .addCase(fetchHallById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentHall = action.payload;
            })
            .addCase(fetchHallById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // --- Create Hall Cases ---
            .addCase(createHall.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createHall.fulfilled, (state, action) => {
                state.isLoading = false;
                state.halls.push(action.payload);
            })
            .addCase(createHall.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // --- Update Hall Cases ---
            .addCase(updateHall.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateHall.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.halls.findIndex(hall => hall._id === action.payload._id);
                if (index !== -1) {
                    state.halls[index] = action.payload;
                }
                if (state.currentHall?._id === action.payload._id) {
                    state.currentHall = action.payload;
                }
            })
            .addCase(updateHall.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // --- Delete Hall Cases ---
            .addCase(deleteHall.pending, (state, action) => {
                state.deletingHallId = action.meta.arg; // Store the hallId being deleted
                state.error = null;
            })
            .addCase(deleteHall.fulfilled, (state, action) => {
                state.deletingHallId = null;
                // Filter out the deleted hall from the state array
                state.halls = state.halls.filter(
                    (hall) => hall._id !== action.payload
                );
            })
            .addCase(deleteHall.rejected, (state, action) => {
                state.deletingHallId = null;
                state.error = action.payload; // Store the error message
            });
    },
});

export const { clearHallError, clearCurrentHall } = hallSlice.actions;

// --- Selectors ---
export const selectAllHalls = (state) => state.halls.halls;
export const selectCurrentHall = (state) => state.halls.currentHall;
export const selectHallsLoading = (state) => state.halls.isLoading;
export const selectHallsError = (state) => state.halls.error;
export const selectDeletingHallId = (state) => state.halls.deletingHallId; // New selector

export default hallSlice.reducer;