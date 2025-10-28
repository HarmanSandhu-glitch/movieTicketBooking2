import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, selectAuthLoading, selectAuthError, clearAuthError } from '../store/slices/authSlice';
import { FaUserPlus } from 'react-icons/fa';
import Loader from '../components/Loader';
import { toast } from 'react-toastify'; // Import toast

function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectAuthLoading);
    const apiError = useSelector(selectAuthError);
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError(null);
        dispatch(clearAuthError());
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }
        dispatch(signup({ name, email, password, confirm_password: confirmPassword }))
            .unwrap()
            .then(() => {
                toast.success('Registration successful! Please sign in.');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            })
            .catch((err) => {
                toast.error(err || 'Sign-up failed');
            });
    };

    const error = localError || apiError;

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md md-card p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="md-label"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="md-input"
                            placeholder="John Doe"
                            disabled={isLoading}
                        />
                    </div>
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
                            disabled={isLoading}
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
                            minLength={6}
                            className="md-input"
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="md-label"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="md-input"
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-primary-DEFAULT text-white font-semibold rounded-md shadow-lg transition-colors duration-300 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <FaUserPlus />
                                    <span>Sign Up</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-gray-400 text-center mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/signin"
                        className="font-medium text-red-500 hover:underline"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUpPage;