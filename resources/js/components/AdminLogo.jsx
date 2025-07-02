import React from 'react';

export default function AdminLogo(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#4b5563"
            stroke="#4b5563"
            strokeWidth="0.5"
        >
            {/* Simple Admin icon - Admin badge with star (darker version) */}

            {/* Badge shape */}
            <path
                d="M12 2L4 6v6c0 5.5 3.8 10 8 11.5 4.2-1.5 8-6 8-11.5V6L12 2z"
                fill="#374151"
                stroke="#4b5563"
                strokeWidth="0.7"
            />

            {/* Admin star */}
            <path
                d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L7 10.5l3.5-.5z"
                fill="#6b7280"
                stroke="#9ca3af"
                strokeWidth="0.5"
            />
        </svg>
    );
}
