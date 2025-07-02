import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import FlashMessageV2 from '../Components/FlashMessageV2';
import { t } from '../lang/translationHelper';
import logo from '../images/logo.jpg';

export default function EnhancedGuestLayout({
  children,
  backgroundImage,
  title,
  subtitle,
  containerClassName = '',
  logoSize = 'w-20 h-20'
}) {
  const [isTablet, setIsTablet] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Detect tablet and orientation
  useEffect(() => {
    const checkTabletAndOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsTablet(width >= 768 && width <= 1024);
      setIsLandscape(width > height);
    };

    // Initial check
    checkTabletAndOrientation();

    // Add event listener for resize and orientation change
    window.addEventListener('resize', checkTabletAndOrientation);
    window.addEventListener('orientationchange', checkTabletAndOrientation);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkTabletAndOrientation);
      window.removeEventListener('orientationchange', checkTabletAndOrientation);
    };
  }, []);

  // Tablet-specific styles
  const getTabletStyles = () => {
    if (!isTablet) return {};

    return {
      backgroundAttachment: 'scroll', // Better performance on tablets
      backgroundPosition: isLandscape ? 'center center' : 'top center',
    };
  };

  // Container styles for tablet
  const getContainerStyles = () => {
    if (!isTablet) return {};

    return {
      width: isLandscape ? '60%' : '85%',
      maxWidth: '500px',
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-0 relative">
      {/* Background Image Container - Fixed position to cover entire viewport */}
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          ...getTabletStyles(),
        }}
      ></div>

      {/* Overlay for better text readability - Reduced opacity */}
      <div className="fixed inset-0 bg-black bg-opacity-50 sm:bg-opacity-40 z-0"></div>

      <FlashMessageV2 />

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 pt-2 sm:pt-0">
        {/* Logo aligned to the left */}
<Link href="/welcome" className="flex items-center mb-4 sm:mb-8">
  <img
    src={logo}
    alt="PlayScore Logo"
    className={`
      ${logoSize} sm:${logoSize} w-16 h-16
      object-contain
      drop-shadow-xl
      mr-2 sm:mr-3
      border-4 border-white border-opacity-80
      rounded-2xl
      shadow-lg
      translate-y-2
      transition-transform duration-300
      bg-white bg-opacity-70
    `}
    style={{
      boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
    }}
  />
  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wider drop-shadow-md">PLAYSCORE</h1>
</Link>

        {/* Title and subtitle remain centered */}
        <div className="text-center">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">{title}</h2>
          )}

          {subtitle && (
            <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 max-w-md mx-auto drop-shadow-md">{subtitle}</p>
          )}
        </div>
      </div>

      <div
        className={`w-full sm:max-w-md mt-4 sm:mt-6 px-5 sm:px-8 py-6 sm:py-8 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm shadow-2xl overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 border-opacity-10 relative z-10 mx-3 sm:mx-0 ${containerClassName}`}
        style={getContainerStyles()}
      >
        {children}
      </div>

      <div className="mt-6 sm:mt-8 text-center text-white text-xs sm:text-sm relative z-10 drop-shadow-md px-4 mb-4 sm:mb-0">
        <p>© {new Date().getFullYear()} PlayScore. {t('common.all_rights_reserved')}</p>
      </div>
    </div>
  );
}
