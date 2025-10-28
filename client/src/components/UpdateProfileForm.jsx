import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateUserProfile,
    selectUser,
    selectIsUpdatingUser,
    selectAuthError,
    clearAuthError,
} from '../store/slices/authSlice';
import Loader from './Loader';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

function UpdateProfileForm() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isUpdating = useSelector(selectIsUpdatingUser);
    const error = useSelector(selectAuthError);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState(null);
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError(null);
        dispatch(clearAuthError());
        if (!name.trim()) {
            setLocalError('Name is required.');
            return;
        }
        if (!email.trim()) {
            setLocalError('Email is required.');
            return;
        }
        if (password && password.length < 6) {
            setLocalError('Password must be at least 6 characters long.');
            return;
        }
        if (password && password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }
        if (password && !confirmPassword) {
            setLocalError('Please confirm your password.');
            return;
        }
        if (!password && confirmPassword) {
            setLocalError('Please enter a new password.');
            return;
        }

        const userData = {
            name: name.trim(),
            email: email.trim(),
        };

        if (password && password.trim()) {
            userData.password = password.trim();
            userData.confirm_password = confirmPassword.trim();
        }

        dispatch(updateUserProfile({ userId: user._id, userData }))
            .unwrap()
            .then(() => {
                toast.success('Profile updated successfully!');
                setPassword('');
                setConfirmPassword('');
            })
            .catch((err) => {
                toast.error(err || 'Profile update failed');
            });
    };

    const displayError = localError || error;

    return (
        <div className="md-card p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">
                Edit Profile
            </h2>

            {displayError && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4" role="alert">
                    <span>{displayError}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="profileName"
                        className="md-label"
                    >
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="profileName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="md-input"
                    />
                </div>
                <div>
                    <label
                        htmlFor="profileEmail"
                        className="md-label"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="profileEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="md-input"
                    />
                </div>

                <hr className="border-gray-600" />
                <p className="text-sm text-gray-400">Leave passwords blank to keep your current password.</p>
                <div>
                    <label
                        htmlFor="profilePassword"
                        className="md-label"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        id="profilePassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        className="md-input"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label
                        htmlFor="profileConfirmPassword"
                        className="md-label"
                    >
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="profileConfirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="md-input"
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-primary-DEFAULT text-white font-semibold rounded-md shadow-lg transition-colors duration-300 hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isUpdating ? (
                            <>
                                <Loader />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FaSave />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateProfileForm;