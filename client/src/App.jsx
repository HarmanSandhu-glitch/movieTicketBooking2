import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

// We will create these page components in the upcoming steps.
// Let's import them here to define the routes.
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ShowDetailsPage from './pages/ShowDetailsPage';
import BookingPage from './pages/BookingPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HallsPage from './pages/HallsPage';
import HallShowsPage from './pages/HallShowsPage';

// We'll also create these layout components.
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// These components will protect routes based on auth status.
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Error boundary for production error handling
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ToastContainer is rendered here for global notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Use dark theme for toasts
      />

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/show/:showId" element={<ShowDetailsPage />} />
            <Route path="/halls" element={<HallsPage />} />
            <Route path="/hall/:hallId/shows" element={<HallShowsPage />} />

            {/* Protected Routes (Requires user to be logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/book/:showId" element={<BookingPage />} />
              {/* Based on your API, :userId is needed for GET /tickets/user/:userId */}
              <Route path="/profile/:userId" element={<UserProfilePage />} />
            </Route>

            {/* Admin Routes (Requires user to be logged in AND be an admin) */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Route>

            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}

export default App;
