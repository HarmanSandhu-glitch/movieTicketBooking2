import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/authSlice';

/**
 * A wrapper component that checks if a user is authenticated.
 * If authenticated, it renders the nested routes.
 * If not, it redirects the user to the /signin page.
 */
function ProtectedRoute() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /signin page, but save the current location they were
        // trying to go to. This allows us to send them back after sign-in.
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // If authenticated, render the child component (e.g., BookingPage, UserProfilePage)
    return <Outlet />;
}

export default ProtectedRoute;