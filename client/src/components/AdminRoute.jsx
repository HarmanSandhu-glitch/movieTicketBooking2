import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAdmin } from '../store/slices/authSlice';

/**
 * A wrapper component that checks if a user is an admin.
 * This component *must* be used as a child of a <ProtectedRoute>
 * to ensure the user is authenticated first.
 *
 * If authenticated and an admin, it renders the nested routes.
 * If not an admin, it redirects the user to the homepage.
 */
function AdminRoute() {
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAdmin) {
    // User is logged in (guaranteed by ProtectedRoute) but not an admin.
    // Redirect them to the homepage.
    return <Navigate to="/" replace />;
  }

  // If authenticated and an admin, render the child component (e.g., AdminDashboardPage)
  return <Outlet />;
}

export default AdminRoute;