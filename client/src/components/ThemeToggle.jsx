import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

/**
 * A component that toggles the site's theme between light and dark.
 * It persists the choice in localStorage.
 */
function ThemeToggle() {
    // Initialize state from localStorage or default to 'dark'
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Effect to apply the theme to the <html> tag and save to localStorage
    useEffect(() => {
        const root = document.documentElement; // The <html> tag
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle function
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
            {theme === 'dark' ? (
                <FaSun className="h-5 w-5 text-yellow-400" />
            ) : (
                <FaMoon className="h-5 w-5 text-primary-light" />
            )}
        </button>
    );
}

export default ThemeToggle;