export default function UserLogo(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#1a202c"
            stroke="#1a202c"
            strokeWidth="0.2"
        >
            {/* User/Gamer icon - Simple gaming controller */}

            {/* User/player icon */}
            <circle cx="12" cy="7" r="3" fill="#1a202c" />
            <path d="M6 21v-2c0-3.3 2.7-6 6-6s6 2.7 6 6v2" stroke="#1a202c" strokeWidth="1.5" fill="none" />

            {/* Controller base - simplified */}
            <rect x="7" y="14" width="10" height="6" rx="2" fill="none" stroke="#1a202c" strokeWidth="0.8" />

            {/* D-pad */}
            <path d="M9 17h2M10 16v2" stroke="#1a202c" strokeWidth="0.8" strokeLinecap="round" />

            {/* Action buttons */}
            <circle cx="14" cy="17" r="0.8" fill="#1a202c" />
        </svg>
    );
}
