import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import hallReducer from './slices/hallSlice';
import showReducer from './slices/showSlice';
import seatReducer from './slices/seatSlice';
import ticketReducer from './slices/ticketSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        halls: hallReducer,
        shows: showReducer,
        seats: seatReducer,
        tickets: ticketReducer,
    },
});