import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectIsAuthenticated, selectUser, selectIsAdmin } from '../store/slices/authSlice';
import { FaTicketAlt, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCog, FaBuilding } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle'; // Import the new component

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get auth state from Redux store
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);

    const handleLogout = () => {
        dispatch(logout());
        // Navigate to home page after logout
        navigate('/');
    };

    const navLinkClass = ({ isActive }) =>
        `md-button ${isActive ? 'md-button-filled' : 'md-button-tonal'} gap-2 px-3 py-2 text-sm`;

    return (
        <nav className="bg-[color:var(--md-sys-color-surface-variant)] border-b border-[color:var(--md-sys-color-outline)]">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* Brand/Logo */}
                    <Link to="/" className="flex flex-shrink-0 items-center gap-2 text-white text-xl font-bold">
                        <FaTicketAlt className="h-6 w-6 text-[color:var(--md-sys-color-primary)]" />
                        <span>MovieBooker</span>
                    </Link>

                    {/* Navigation Links & Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        {/* Public navigation link */}
                        <NavLink to="/halls" className={navLinkClass}>
                            <FaBuilding />
                            <span>Halls</span>
                        </NavLink>


                        {isAuthenticated ? (
                            // --- Authenticated User Links ---
                            <>
                                {isAdmin && (
                                    <NavLink to="/admin/dashboard" className={navLinkClass}>
                                        <FaCog />
                                        <span>Admin</span>
                                    </NavLink>
                                )}
                                <NavLink to={`/profile/${user?._id}`} className={navLinkClass}>
                                    <FaUser />
                                    <span>{user?.name || 'Profile'}</span>
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="md-button md-button-outline gap-2 px-3 py-2 text-sm"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            // --- Guest User Links ---
                            <>
                                <NavLink to="/signin" className={navLinkClass}>
                                    <FaSignInAlt />
                                    <span>Sign In</span>
                                </NavLink>
                                <NavLink to="/signup" className={navLinkClass}>
                                    <FaUserPlus />
                                    <span>Sign Up</span>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;