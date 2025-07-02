import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(null);

    // Get flash messages from Inertia props
    const page = usePage();
    
    useEffect(() => {
        try {
            // Safely access props and flash
            const flash = page?.props?.flash;
            
            if (flash) {
                if (flash.success) {
                    setMessage(flash.success);
                    setType('success');
                    setVisible(true);
                } else if (flash.error) {
                    setMessage(flash.error);
                    setType('error');
                    setVisible(true);
                }
                
                // Auto-hide the message after 5 seconds
                if (flash.success || flash.error) {
                    const timer = setTimeout(() => {
                        setVisible(false);
                    }, 5000);
                    
                    return () => clearTimeout(timer);
                }
            }
        } catch (error) {
            console.error('Error in FlashMessage component:', error);
        }
    }, [page?.props?.flash]);

    // If not visible or no message, don't render anything
    if (!visible || !message || message === null || message === undefined) return null;

    try {
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
    } catch (error) {
        console.error('Error rendering FlashMessage:', error);
        return null;
    }
}