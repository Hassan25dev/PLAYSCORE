export default function NotificationLogo(props) {
    // Combine passed props with our default styling
    const combinedProps = {
        ...props,
        className: `${props.className || ''} h-7 w-7`,
        style: { ...props.style, color: '#6B7280' } // Using a more subtle gray color
    };

    return (
        <svg
            {...combinedProps}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
    );
}
