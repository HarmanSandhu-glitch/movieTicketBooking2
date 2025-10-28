import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    show: null,
    // 'seatLayout' will be the object { 'A': [...], 'B': [...] }
    seatLayout: {},
    // 'seats' will be the flat list of all seats
    seats: [],
    totalSeats: 0,
    availableSeats: 0,
    bookedSeats: 0,
    isLoading: false,
    error: null,
};


export const fetchSeatsForShow = createAsyncThunk(
    'seats/fetchForShow',
    async (showId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/seats/show/${showId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch seats');
        }
    }
);
const seatSlice = createSlice({
    name: 'seats',
    initialState,
    reducers: {
        clearSeatLayout: (state) => {
            state.show = null;
            state.seatLayout = {};
            state.seats = [];
            state.totalSeats = 0;
            state.availableSeats = 0;
            state.bookedSeats = 0;
            state.isLoading = false;
            state.error = null;
        },
        clearSeatError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Seats For Show Cases ---
            .addCase(fetchSeatsForShow.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                // Clear previous layout while loading new one
                state.seatLayout = {};
                state.seats = [];
                state.show = null;
            })
            .addCase(fetchSeatsForShow.fulfilled, (state, action) => {
                state.isLoading = false;
                // Populate state directly from the API response data object
                state.show = action.payload.show;
                state.seatLayout = action.payload.seatLayout;
                state.seats = action.payload.seats;
                state.totalSeats = action.payload.totalSeats;
                state.availableSeats = action.payload.availableSeats;
                state.bookedSeats = action.payload.bookedSeats;
            })
            .addCase(fetchSeatsForShow.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSeatLayout, clearSeatError } = seatSlice.actions;

// --- Selectors ---
export const selectSeatLayout = (state) => state.seats.seatLayout;
export const selectSeatShowInfo = (state) => state.seats.show;
export const selectSeatsLoading = (state) => state.seats.isLoading;
export const selectSeatsError = (state) => state.seats.error;
export const selectAvailableSeatsCount = (state) => state.seats.availableSeats;

export default seatSlice.reducer;