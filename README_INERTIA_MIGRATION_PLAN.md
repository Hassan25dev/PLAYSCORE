# Migration Plan: Laravel + React to Laravel + Inertia.js + React

## Overview
This document outlines the step-by-step plan to migrate your current Laravel + React setup to use Inertia.js with React. This migration will simplify frontend-backend integration by leveraging Inertia.js to handle routing and page rendering seamlessly.

---

## Step 1: Install Inertia.js Packages

- Run the following commands to install Inertia server-side and client-side packages:

```bash
composer require inertiajs/inertia-laravel
npm install @inertiajs/inertia @inertiajs/inertia-react
```

---

## Step 2: Configure Laravel Middleware

- Register the Inertia middleware in `app/Http/Kernel.php` under the `web` middleware group:

```php
use Inertia\Middleware;

protected $middlewareGroups = [
    'web' => [
        // other middleware...
        \App\Http\Middleware\HandleInertiaRequests::class,
    ],
];
```

- Publish the Inertia middleware:

```bash
php artisan inertia:middleware
```

---

## Step 3: Update React Frontend Entry Point

- Replace your current React entry point to use Inertia's React adapter.

- Create an `app.js` or equivalent that initializes Inertia React app:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';

createInertiaApp({
  resolve: name => import(`./Pages/${name}`),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
```

- Organize your React components as Inertia pages under `resources/js/Pages`.

---

## Step 4: Modify Laravel Controllers

- Change controller methods to return Inertia responses instead of Blade views:

```php
use Inertia\Inertia;

public function index()
{
    $jeux = Jeu::paginate(12);
    return Inertia::render('Jeux/Index', [
        'jeux' => $jeux,
    ]);
}
```

---

## Step 5: Replace Blade Views

- Replace Blade views that load React with a single Inertia root view, e.g., `resources/views/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @viteReactRefresh
    @vite('resources/js/app.js')
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

- Update routes to use this root view.

---

## Step 6: Update Routing and Navigation

- Use Inertia's `<Link>` component for client-side navigation.

- Use Inertia form helpers for form submissions.

---

## Step 7: Update Vite Configuration

- Ensure Vite is configured to support React and Inertia.

- Example `vite.config.js` or `vite.config.mjs`:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.js'],
      refresh: true,
    }),
    react(),
  ],
});
```

---

## Step 8: Testing and Validation

- Run Laravel dev server and Vite dev server concurrently.

- Test navigation, page rendering, and hot module replacement.

- Fix any issues related to data passing or routing.

---

## Summary

Migrating to Inertia.js will:

- Simplify frontend-backend integration.

- Eliminate complex asset proxying issues.

- Provide SPA-like experience with server-side routing.

- Improve developer experience with hot reloading and easier state management.

---

Please confirm if you want me to start implementing these steps one by one.
