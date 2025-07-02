console.log('Test app starting...');

import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('Test app: React imported');

// Simple test component
function TestApp() {
    console.log('TestApp component rendering');
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#f0f0f0',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#22c55e', marginBottom: '1rem' }}>✅ React is Working!</h1>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                    This is a minimal React test without Inertia.js
                </p>
                <p style={{ fontSize: '0.875rem', color: '#999' }}>
                    Time: {new Date().toLocaleTimeString()}
                </p>
                <button 
                    onClick={() => alert('Button clicked!')}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Test Button
                </button>
            </div>
        </div>
    );
}

console.log('Test app: Component defined');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Test app: DOM ready');
    
    // Find the app element
    const appElement = document.getElementById('app');
    if (!appElement) {
        console.error('Test app: #app element not found');
        return;
    }
    
    console.log('Test app: Creating React root');
    const root = createRoot(appElement);
    
    console.log('Test app: Rendering component');
    root.render(<TestApp />);
    
    console.log('Test app: Render complete');
});

console.log('Test app: Script loaded');
