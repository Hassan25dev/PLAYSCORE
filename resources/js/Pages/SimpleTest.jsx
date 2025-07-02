import React from 'react';
import { Head } from '@inertiajs/react';

export default function SimpleTest({ message = "Simple Test Page" }) {
    return (
        <>
            <Head title="Simple Test" />
            <div style={{ 
                padding: '20px', 
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f0f0f0',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h1 style={{ color: '#333', marginBottom: '20px' }}>
                    🎉 React + Inertia.js Working!
                </h1>
                <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>
                    {message}
                </p>
                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    maxWidth: '600px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#28a745', marginBottom: '15px' }}>
                        ✅ Application Status: WORKING
                    </h2>
                    <ul style={{ textAlign: 'left', color: '#555' }}>
                        <li>✅ Laravel Server: Running</li>
                        <li>✅ React: Loaded</li>
                        <li>✅ Inertia.js: Connected</li>
                        <li>✅ Vite Build: Successful</li>
                        <li>✅ Database: Connected</li>
                    </ul>
                    <p style={{ marginTop: '20px', color: '#666' }}>
                        Current time: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </>
    );
}
