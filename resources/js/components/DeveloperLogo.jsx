export default function DeveloperLogo(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            stroke="white"
            strokeWidth="0.2"
        >
            {/* Developer/Game Creation icon - Modern game development concept with blue theme */}
            <defs>
                <linearGradient id="devGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ebf8ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#63b3ed" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4299e1" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#2b6cb0" stopOpacity="0.8" />
                </linearGradient>
                <filter id="devGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="blueInnerGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Blue glow background */}
            <circle cx="12" cy="12" r="10" fill="#4299e1" opacity="0.2" filter="url(#blueInnerGlow)" />

            {/* Monitor/Screen base */}
            <rect x="2" y="3" width="20" height="14" rx="1" fill="url(#blueGradient)" filter="url(#devGlow)" />

            {/* Screen content - game world */}
            <rect x="3" y="4" width="18" height="12" rx="0.5" fill="#2c5282" fillOpacity="0.3" stroke="white" strokeWidth="0.5" />

            {/* Code elements */}
            <path d="M6 7l-1.5 2L6 11" fill="none" stroke="#bde3ff" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 7l1.5 2L10 11" fill="none" stroke="#bde3ff" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 13l1-6" fill="none" stroke="#bde3ff" strokeWidth="0.7" strokeLinecap="round" />

            {/* Game character */}
            <circle cx="15" cy="8" r="1.2" fill="#90cdf4" opacity="0.9" />
            <path d="M13.5 12c0-1.5 3-1.5 3 0" fill="none" stroke="#90cdf4" strokeWidth="0.7" strokeLinecap="round" />

            {/* Game elements */}
            <rect x="17" y="6" width="1" height="1" rx="0.2" fill="#bee3f8" opacity="0.9" />
            <rect x="17" y="9" width="1" height="1" rx="0.2" fill="#bee3f8" opacity="0.9" />
            <rect x="17" y="12" width="1" height="1" rx="0.2" fill="#bee3f8" opacity="0.9" />

            {/* Monitor stand */}
            <path d="M10 17h4v2h-4z" fill="url(#blueGradient)" />
            <path d="M8 19h8v1H8z" fill="url(#blueGradient)" />

            {/* Gamepad below */}
            <path d="M15 20.5c0 0.8-1.3 1.5-3 1.5s-3-0.7-3-1.5" fill="none" stroke="#90cdf4" strokeWidth="0.5" />
        </svg>
    );
}
