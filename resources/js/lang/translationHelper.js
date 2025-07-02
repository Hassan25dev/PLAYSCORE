import en from './en.json';
import fr from './fr.json';
import React from 'react';

const translations = { en, fr };

// Simple global variable to track current locale
let currentLocale = 'fr'; // Default to French

// Safe function to check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Initialize locale from various sources - but only if in browser
const initLocale = () => {
  // Skip initialization during SSR or module evaluation
  if (!isBrowser()) return;

  try {
    // Try to get from localStorage first (user preference)
    try {
      const storedLocale = localStorage.getItem('userLocale');
      if (storedLocale && translations[storedLocale]) {
        currentLocale = storedLocale;
        console.log('Using locale from localStorage:', currentLocale);
        return;
      }
    } catch (e) {
      console.warn('Could not access localStorage:', e);
    }

    // Try to get from document lang attribute
    try {
      const htmlLang = document.documentElement.lang;
      if (htmlLang && translations[htmlLang]) {
        currentLocale = htmlLang;
        console.log('Using locale from HTML lang attribute:', currentLocale);
        return;
      }
    } catch (e) {
      console.warn('Could not access document.documentElement:', e);
    }

    // Try to get from browser settings
    try {
      if (navigator.language) {
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) {
          currentLocale = browserLang;
          console.log('Using locale from browser settings:', currentLocale);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not access navigator.language:', e);
    }

    // Default fallback
    console.log('Using default locale:', currentLocale);
  } catch (error) {
    console.error('Error initializing locale:', error);
    // Keep the default 'fr'
  }
};

// Only initialize in browser environment
if (isBrowser()) {
  // Use setTimeout to ensure DOM is ready
  setTimeout(initLocale, 0);
}

// Debug flag - disable logging in production
const DEBUG = process.env.NODE_ENV !== 'production';

// Cache for frequently accessed translations
const translationCache = {};

/**
 * Sets the current locale for translations
 * @param {string} locale - The locale code to set (e.g., 'en', 'fr')
 * @returns {boolean} True if locale was set successfully, false otherwise
 */
export function setLocale(locale) {
  // Validate locale
  if (!translations[locale]) {
    console.warn('Locale not found:', locale);
    return false;
  }

  // Set the locale
  currentLocale = locale;

  // Store in localStorage for persistence
  if (isBrowser()) {
    try {
      localStorage.setItem('userLocale', locale);
    } catch (e) {
      console.warn('Could not save locale to localStorage:', e);
    }
  }

  // Clear translation cache completely
  Object.keys(translationCache).forEach(key => {
    delete translationCache[key];
  });

  console.log('Locale set to:', currentLocale);

  // Set HTML lang attribute to help with accessibility and SEO
  if (isBrowser() && document.documentElement) {
    document.documentElement.lang = locale;
  }

  // Force a re-render by dispatching a custom event
  if (isBrowser()) {
    try {
      // Use a more specific event name to avoid conflicts
      const event = new CustomEvent('appLocaleChanged', {
        detail: {
          locale,
          timestamp: Date.now() // Add timestamp to ensure uniqueness
        },
        bubbles: true, // Make sure the event bubbles up through the DOM
        cancelable: false
      });
      document.dispatchEvent(event);

      // Also dispatch the original event for backward compatibility
      const legacyEvent = new CustomEvent('localeChanged', {
        detail: { locale },
        bubbles: true,
        cancelable: false
      });
      document.dispatchEvent(legacyEvent);

      // Force a small delay and then dispatch again to ensure all components catch it
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('appLocaleChanged', {
          detail: {
            locale,
            timestamp: Date.now() + 1 // Different timestamp
          },
          bubbles: true,
          cancelable: false
        }));
      }, 50);
    } catch (e) {
      console.warn('Could not dispatch locale change events:', e);
    }
  }

  return true;
}

/**
 * Returns the current active locale
 * @returns {string} The current locale code
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Returns all available locales
 * @returns {Object} Object containing all available translations
 */
export function getAvailableLocales() {
  return Object.keys(translations).map(code => ({
    code,
    label: code.toUpperCase()
  }));
}

/**
 * Translates a key into the current locale
 * @param {string} key - Dot notation path to the translation (e.g., 'welcome.hero_title')
 * @param {Object} replacements - Object containing replacement values (e.g., {year: 2023})
 * @returns {string} The translated string or the key if translation not found
 */
/**
 * React hook for using translations in components
 * @returns {Object} Object containing t function and current locale
 */
export function useTranslation() {
  // Use React's useState and useEffect to make the hook reactive
  const [locale, setLocaleState] = React.useState(currentLocale);

  // Listen for locale changes
  React.useEffect(() => {
    const handleLocaleChange = (e) => {
      setLocaleState(e.detail.locale);
    };

    // Listen for both event types
    document.addEventListener('localeChanged', handleLocaleChange);
    document.addEventListener('appLocaleChanged', handleLocaleChange);

    // Cleanup
    return () => {
      document.removeEventListener('localeChanged', handleLocaleChange);
      document.removeEventListener('appLocaleChanged', handleLocaleChange);
    };
  }, []);

  // Create a memoized translation function that uses the current locale
  const translationFunction = React.useCallback((key, replacements = {}) => {
    return t(key, replacements);
  }, [locale]); // Re-create when locale changes

  // Create a memoized setLocale function that updates the local state
  const setLocaleFunction = React.useCallback((newLocale) => {
    setLocale(newLocale);
    setLocaleState(newLocale);
  }, []);

  return {
    t: translationFunction,
    locale,
    setLocale: setLocaleFunction,
    getAvailableLocales
  };
}

export function t(key, replacements = {}) {
  // Safety check for key
  if (!key || typeof key !== 'string') {
    console.error('Invalid translation key:', key);
    return key || '';
  }

  // Check cache first
  const cacheKey = `${currentLocale}:${key}`;
  if (Object.keys(replacements).length === 0 && translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Get the translation
    const keys = key.split('.');
    let result = translations[currentLocale];
    let missingKey = false;
    let missingKeyPath = '';

    // Special case for admin dashboard sections and notifications that might be using PHP translations
    // This helps bridge the gap between PHP and JS translation systems
    if ((key.startsWith('admin.') &&
        (key.includes('review_moderation') ||
         key.includes('user_management') ||
         key.includes('comment_moderation'))) ||
        key.startsWith('notifications.messages.')) {

      // Try alternative key formats
      const alternativeKeys = [
        key,
        // Try without 'admin.' prefix for nested keys
        key.replace(/^admin\./, ''),
        // Try with different section naming
        key.replace('review_moderation', 'reviews'),
        key.replace('user_management', 'users'),
        key.replace('comment_moderation', 'comments'),
        // Try with different separators
        key.replace(/\./g, '_'),
        // Try with different casing
        key.toLowerCase()
      ];

      // Add special handling for notification messages
      if (key.startsWith('notifications.messages.')) {
        // Extract the notification type from the key
        const notificationType = key.replace('notifications.messages.', '');

        // Add additional alternative keys for notifications
        alternativeKeys.push(
          // Try looking up in the types section
          `notifications.types.${notificationType}`,
          // Try direct access without the messages prefix
          `notifications.${notificationType}`
        );
      }

      // Try each alternative key
      for (const altKey of alternativeKeys) {
        const altKeys = altKey.split('.');
        let altResult = translations[currentLocale];
        let altFound = true;

        for (const k of altKeys) {
          if (altResult && typeof altResult === 'object' && k in altResult) {
            altResult = altResult[k];
          } else {
            altFound = false;
            break;
          }
        }

        if (altFound && typeof altResult === 'string') {
          if (DEBUG) {
            console.log(`Found alternative translation for '${key}' using '${altKey}'`);
          }

          // Handle replacements
          if (Object.keys(replacements).length > 0) {
            Object.keys(replacements).forEach(placeholder => {
              // Support both {placeholder} and :placeholder formats for replacements
              altResult = altResult.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
              altResult = altResult.replace(new RegExp(`:${placeholder}`, 'g'), replacements[placeholder]);
            });
          }

          // Cache the result
          if (Object.keys(replacements).length === 0) {
            translationCache[cacheKey] = altResult;
          }

          return altResult;
        }
      }
    }

    // Standard translation lookup
    // Navigate through the nested objects
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        missingKey = true;
        missingKeyPath = key;

        // Try fallback to English if we're not already using English
        if (currentLocale !== 'en') {
          let fallback = translations['en'];
          let fallbackFound = true;

          for (const fk of keys) {
            if (fallback && typeof fallback === 'object' && fk in fallback) {
              fallback = fallback[fk];
            } else {
              fallbackFound = false;
              break;
            }
          }

          if (fallbackFound) {
            // Log that we're using a fallback
            if (DEBUG) {
              console.warn(`Translation key '${key}' missing in '${currentLocale}', using English fallback`);
            }
            result = fallback;
            missingKey = false;
          } else {
            // No translation found in any language
            if (DEBUG) {
              console.error(`Translation key '${key}' missing in both '${currentLocale}' and fallback language`);
            }

            // For admin dashboard sections, provide a more user-friendly fallback
            if (key.startsWith('admin.')) {
              // Extract the last part of the key as a readable fallback
              const parts = key.split('.');
              const lastPart = parts[parts.length - 1];
              // Convert snake_case or camelCase to Title Case
              const readableFallback = lastPart
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^\w/, c => c.toUpperCase());

              return readableFallback;
            }

            return key;
          }
        } else {
          // No fallback available since we're already in English
          if (DEBUG) {
            console.error(`Translation key '${key}' missing in English translations`);
          }

          // For admin dashboard sections, provide a more user-friendly fallback
          if (key.startsWith('admin.')) {
            // Extract the last part of the key as a readable fallback
            const parts = key.split('.');
            const lastPart = parts[parts.length - 1];
            // Convert snake_case or camelCase to Title Case
            const readableFallback = lastPart
              .replace(/_/g, ' ')
              .replace(/([A-Z])/g, ' $1')
              .replace(/^\w/, c => c.toUpperCase());

            return readableFallback;
          }

          return key;
        }
      }
    }

    // Handle replacements
    if (typeof result === 'string' && Object.keys(replacements).length > 0) {
      Object.keys(replacements).forEach(placeholder => {
        // Support both {placeholder} and :placeholder formats for replacements
        result = result.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
        result = result.replace(new RegExp(`:${placeholder}`, 'g'), replacements[placeholder]);
      });
    }

    // Cache the result if it's a string and has no replacements
    if (typeof result === 'string' && Object.keys(replacements).length === 0) {
      translationCache[cacheKey] = result;
    }

    return result || key;
  } catch (error) {
    console.error('Error translating key:', key, error);

    // For admin dashboard sections, provide a more user-friendly fallback
    if (key.startsWith('admin.')) {
      // Extract the last part of the key as a readable fallback
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      // Convert snake_case or camelCase to Title Case
      const readableFallback = lastPart
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^\w/, c => c.toUpperCase());

      return readableFallback;
    }

    return key;
  }
}
