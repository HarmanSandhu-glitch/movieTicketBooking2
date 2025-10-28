import React from 'react';

/**
 * A simple, reusable loading spinner component.
 */
function Loader() {
    return (
        <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-light border-t-transparent"
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export default Loader;