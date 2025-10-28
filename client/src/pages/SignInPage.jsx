import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin, selectIsAuthenticated, selectAuthLoading, selectAuthError, clearAuthError } from '../store/slices/authSlice';
import { FaSignInAlt } from 'react-icons/fa';
import Loader from '../components/Loader';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const from = location.state?.from?.pathname ||
        localStorage.getItem('redirectAfterLogin') ||
        '/';
    useEffect(() => {
        if (isAuthenticated) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            return; 
        }
        dispatch(signin({ email, password }));
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md md-card p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Sign In
                </h2>
                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="md-label"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="md-input"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="md-label"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="md-input"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-primary-DEFAULT text-white font-semibold rounded-md shadow-lg transition-colors duration-300 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-gray-400 text-center mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-red-500 hover:underline"
                    >
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignInPage;