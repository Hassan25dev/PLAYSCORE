import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from './Layouts/MainLayout';

// @vite-ignore
createInertiaApp({
  resolve: name => {
    if (name === 'Jeux/Index') {
      return import('./Pages/Jeux/Index.jsx');
    }
    if (name === 'Jeux/Show') {
      return import('./Pages/Jeux/Show.jsx');
    }
    if (name === 'Auth/Login') {
      return import('./Pages/Auth/Login.jsx');
    }
    if (name === 'Auth/Register') {
      return import('./Pages/Auth/Register.jsx');
    }
    if (name === 'Auth/Profile') {
      return import('./Pages/Auth/Profile.jsx');
    }
    if (name === 'Auth/VerifyEmail') {
      return import('./Pages/Auth/VerifyEmail.jsx');
    }
    if (name === 'Auth/ForgotPassword') {
      return import('./Pages/Auth/ForgotPassword.jsx');
    }
    if (name === 'Auth/ResetPassword') {
      return import('./Pages/Auth/ResetPassword.jsx');
    }
    if (name === 'Welcome') {
      return import('./Pages/Welcome.jsx');
    }
    throw new Error(`Unknown page: ${name}`);
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <Provider store={store}>
        <MainLayout>
          <App {...props} />
        </MainLayout>
      </Provider>
    );
  },
});
