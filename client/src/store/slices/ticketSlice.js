import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
    tickets: [],
    currentTicket: null,
    isLoading: false,
    updatingTicketId: null,
    error: null,
};
export const bookTicket = createAsyncThunk(
    'tickets/book',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/tickets/generate', bookingData);
            return response.data.data.ticket;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ticket booking failed');
        }
    }
);

export const fetchUserTickets = createAsyncThunk(
    'tickets/fetchByUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/tickets/user/${userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'tickets/updateStatus',
    async ({ ticketId, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/tickets/${ticketId}/update-status`, { status });
            return response.data.data.ticket;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update ticket');
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        clearTicketError: (state) => {
            state.error = null;
        },
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
        clearUserTickets: (state) => {
            state.tickets = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookTicket.pending, (state) => {
                state.isLoading = true;
                state.currentTicket = null;
                state.error = null;
            })
            .addCase(bookTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentTicket = action.payload;
            })
            .addCase(bookTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserTickets.pending, (state) => {
                state.isLoading = true;
                state.tickets = [];
                state.error = null;
            })
            .addCase(fetchUserTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchUserTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateTicketStatus.pending, (state, action) => {
                state.updatingTicketId = action.meta.arg.ticketId;
                state.error = null;
            })
            .addCase(updateTicketStatus.fulfilled, (state, action) => {
                state.updatingTicketId = null;
                const index = state.tickets.findIndex(
                    (ticket) => ticket._id === action.payload._id
                );
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(updateTicketStatus.rejected, (state, action) => {
                state.updatingTicketId = null;
                state.error = action.payload;
            });
    },
});

export const { clearTicketError, clearCurrentTicket, clearUserTickets } = ticketSlice.actions;
export const selectUserTickets = (state) => state.tickets.tickets;
export const selectCurrentTicket = (state) => state.tickets.currentTicket;
export const selectTicketsLoading = (state) => state.tickets.isLoading;
export const selectUpdatingTicketId = (state) => state.tickets.updatingTicketId; // New selector
export const selectTicketsError = (state) => state.tickets.error;

export default ticketSlice.reducer;