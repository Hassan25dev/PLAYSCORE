import './bootstrap';
import '../css/app.css';

// Import translation helper first to ensure it's initialized
import { setLocale, getLocale, t } from './lang/translationHelper';

import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Provider } from 'react-redux';
import { store } from './logiqueredux/store';

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Initialize translations based on the HTML lang attribute
// This will run only in the browser, not during SSR
if (typeof window !== 'undefined') {
  // Use a safer approach with setTimeout to ensure DOM is ready
  setTimeout(() => {
    try {
      const htmlLang = document.documentElement.lang;
      if (htmlLang) {
        console.log('Setting initial locale from HTML lang attribute:', htmlLang);
        setLocale(htmlLang);
      }
    } catch (error) {
      console.error('Error setting initial locale:', error);
    }
  }, 0);
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log('Resolving page:', name);
        // Add more detailed logging
        const pages = import.meta.glob('./Pages/**/*.jsx');
        console.log('Available pages:', Object.keys(pages));
        console.log('Looking for:', `./Pages/${name}.jsx`);

        // Special case for Developer Dashboard
        if (name === 'Developer/Dashboard') {
            console.log('Attempting to resolve Developer Dashboard directly');
            return lazy(() => import('./Pages/Developer/Dashboard.jsx'));
        }

        // Use lazy loading for all components
        return lazy(() => {
            const resolved = resolvePageComponent(`./Pages/${name}.jsx`, pages);
            return resolved;
        });
    },
    setup({ el, App, props }) {
        try {
            // Set locale from props if available
            if (props?.initialPage?.props?.locale) {
                console.log('Setting locale from Inertia props:', props.initialPage.props.locale);
                setLocale(props.initialPage.props.locale);
            } else if (props?.initialPage?.props?.auth?.locale) {
                console.log('Setting locale from auth props:', props.initialPage.props.auth.locale);
                setLocale(props.initialPage.props.auth.locale);
            }
        } catch (error) {
            console.error('Error setting locale from props:', error);
        }

        const root = createRoot(el);
        root.render(
            <Provider store={store}>
                <Suspense fallback={<LoadingComponent />}>
                    <App {...props} />
                </Suspense>
            </Provider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
