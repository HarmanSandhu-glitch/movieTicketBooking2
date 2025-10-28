import React from 'react';
import { FaTicketAlt } from 'react-icons/fa';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-16 border-t-2 border-red-600 bg-gradient-to-b ">
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="flex justify-center items-center gap-2 mb-3">
                    <FaTicketAlt className="h-6 w-6 text-red-500" />
                    <span className="font-bold text-lg text-white">MovieBooker</span>
                </div>
                <p className="text-sm text-gray-400">
                    &copy; {currentYear} MovieBooker. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;