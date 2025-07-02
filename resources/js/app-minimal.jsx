import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

console.log('Minimal app.jsx: Starting');

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log('Minimal app.jsx: Resolving page:', name);
        return resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
    },
    setup({ el, App, props }) {
        console.log('Minimal app.jsx: Setup called');
        const root = createRoot(el);
        root.render(<App {...props} />);
        console.log('Minimal app.jsx: Rendered');
    },
    progress: {
        color: '#4B5563',
    },
}).then(() => {
    console.log('Minimal app.jsx: Inertia app created successfully');
}).catch(error => {
    console.error('Minimal app.jsx: Error creating Inertia app:', error);
});
