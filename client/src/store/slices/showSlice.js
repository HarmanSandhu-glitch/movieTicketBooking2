import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const createShow = createAsyncThunk(
  'shows/createShow',
  async (showData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/shows/create', showData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create show');
    }
  }
);

export const updateShow = createAsyncThunk(
  'shows/updateShow',
  async ({ id, showData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/shows/${id}/update`, showData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update show');
    }
  }
);
export const fetchAllShows = createAsyncThunk(
  'shows/fetchAllShows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/shows/all');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shows');
    }
  }
); 6
export const fetchShowById = createAsyncThunk(
  'shows/fetchShowById',
  async (showId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/shows/${showId}`);
      return response.data.data.show;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch show');
    }
  }
);
export const deleteShow = createAsyncThunk(
  'shows/deleteShow',
  async (showId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/shows/${showId}/delete`);
      return showId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete show');
    }
  }
);
const showSlice = createSlice({
  name: 'shows',
  initialState: {
    shows: [],
    currentShow: null,
    deletingShowId: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    clearCurrentShow: (state) => {
      state.currentShow = null;
    },
    clearShowError: (state) => {
      state.error = null;
    },
    setDeletingShowId: (state, action) => {
      state.deletingShowId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShow.fulfilled, (state, action) => {
        state.loading = false;
        state.shows.unshift(action.payload);
      })
      .addCase(createShow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateShow.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateShow.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.shows.findIndex(show => show._id === action.payload._id);
        if (index !== -1) {
          state.shows[index] = action.payload;
        }
        if (state.currentShow && state.currentShow._id === action.payload._id) {
          state.currentShow = action.payload;
        }
      })
      .addCase(updateShow.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      .addCase(fetchAllShows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload.shows || action.payload;
      })
      .addCase(fetchAllShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchShowById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShow = action.payload;
      })
      .addCase(fetchShowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteShow.pending, (state, action) => {
        state.deletingShowId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteShow.fulfilled, (state, action) => {
        state.deletingShowId = null;
        state.shows = state.shows.filter(show => show._id !== action.payload);
      })
      .addCase(deleteShow.rejected, (state, action) => {
        state.deletingShowId = null;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentShow, clearShowError, setDeletingShowId } = showSlice.actions;

export const selectAllShows = (state) => state.shows.shows;
export const selectCurrentShow = (state) => state.shows.currentShow;
export const selectShowsLoading = (state) => state.shows.loading;
export const selectShowsUpdating = (state) => state.shows.updating;
export const selectShowsError = (state) => state.shows.error;
export const selectDeletingShowId = (state) => state.shows.deletingShowId;

export default showSlice.reducer;
