console.log('DEBUG: app-debug.jsx starting...');

import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('DEBUG: React imported successfully');

// Super simple test component
function DebugApp() {
    console.log('DEBUG: DebugApp component rendering');
    return (
        <div style={{ 
            padding: '2rem',
            backgroundColor: '#f0f8ff',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ color: '#22c55e' }}>🎉 React is Working!</h1>
            <p>This is a minimal React test without any dependencies.</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px' }}>
                <h2>Debug Information:</h2>
                <ul>
                    <li>React: ✅ Loaded</li>
                    <li>Component: ✅ Rendered</li>
                    <li>DOM: ✅ Ready</li>
                </ul>
            </div>
        </div>
    );
}

console.log('DEBUG: Component defined');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DEBUG: DOM ready');
    
    // Find the app element
    const appElement = document.getElementById('app');
    if (!appElement) {
        console.error('DEBUG: #app element not found in DOM');
        console.log('DEBUG: Available elements:', document.body.innerHTML);
        return;
    }
    
    console.log('DEBUG: #app element found:', appElement);
    console.log('DEBUG: Creating React root');
    
    try {
        const root = createRoot(appElement);
        console.log('DEBUG: React root created successfully');
        
        console.log('DEBUG: Rendering component');
        root.render(<DebugApp />);
        console.log('DEBUG: Component rendered successfully');
    } catch (error) {
        console.error('DEBUG: Error during React setup:', error);
    }
});

console.log('DEBUG: Script loaded completely');
