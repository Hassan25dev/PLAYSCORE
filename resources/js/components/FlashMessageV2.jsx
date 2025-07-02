import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessageV2() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(null);

    // Get the page object
    const page = usePage();

    useEffect(() => {
        try {
            // Safely check if flash messages exist
            const flash = page?.props?.flash;
            
            // If flash doesn't exist, don't do anything
            if (!flash) return;
            
            // Check for success message
            if (flash.success) {
                setMessage(flash.success);
                setType('success');
                setVisible(true);
            } 
            // Check for error message
            else if (flash.error) {
                setMessage(flash.error);
                setType('error');
                setVisible(true);
            }
            // No flash messages, hide the component
            else {
                setVisible(false);
                return;
            }
            
            // Auto-hide the message after 5 seconds
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);
            
            // Clean up the timer when the component unmounts or when the effect runs again
            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Error in FlashMessageV2 component:', error);
            // In case of error, don't show anything
            setVisible(false);
        }
    }, [page?.props?.flash]);

    // Don't render anything if not visible or no message
    if (!visible || !message) return null;

    // Render the appropriate message type
    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            {type === 'success' && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex justify-between items-start">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{message}</span>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-green-700 hover:text-green-900">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
            {type === 'error' && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex justify-between items-start">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{message}</span>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-red-700 hover:text-red-900">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}