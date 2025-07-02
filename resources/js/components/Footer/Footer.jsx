import React, { useEffect, useRef } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { t } from '../../lang/translationHelper';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerSectionsRef = useRef([]);

  // Add intersection observer to animate footer sections on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all footer sections
    footerSectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      if (footerSectionsRef.current) {
        footerSectionsRef.current.forEach(section => {
          if (section) observer.unobserve(section);
        });
      }
    };
  }, []);

  // Add a section to the refs array
  const addToRefs = (el) => {
    if (el && !footerSectionsRef.current.includes(el)) {
      footerSectionsRef.current.push(el);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section" ref={addToRefs}>
          <h3>{t('welcome.footer_about_us') || 'About PlayScore'}</h3>
          <p>
            {t('welcome.footer_about_description') || 'PlayScore is your destination to discover, rate, and track your favorite video games. Join our community of passionate gamers and share your gaming experience!'}
          </p>
        </div>

        <div className="footer-section" ref={addToRefs}>
          <h3>{t('welcome.footer_navigation') || 'Navigation'}</h3>
          <ul>
            <li>
              <InertiaLink href="/">{t('header.home') || 'Home'}</InertiaLink>
            </li>
            <li>
              <InertiaLink href="/jeux">{t('header.games') || 'Games'}</InertiaLink>
            </li>
            <li>
              <InertiaLink href="/profile">{t('header.profile') || 'Profile'}</InertiaLink>
            </li>
            <li>
              <InertiaLink href="/about">{t('header.about') || 'About'}</InertiaLink>
            </li>
            <li>
              <InertiaLink href="/contact">{t('header.contact') || 'Contact'}</InertiaLink>
            </li>
          </ul>
        </div>

        <div className="footer-section" ref={addToRefs}>
          <h3>{t('welcome.footer_useful_links') || 'Useful Links'}</h3>
          <ul>
            <li>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                {t('welcome.terms_of_use') || 'Terms of Use'}
              </a>
            </li>
            <li>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                {t('welcome.privacy_policy') || 'Privacy Policy'}
              </a>
            </li>
            <li>
              <a href="/faq" target="_blank" rel="noopener noreferrer">
                {t('welcome.footer_faq') || 'FAQ'}
              </a>
            </li>
            <li>
              <a href="/support" target="_blank" rel="noopener noreferrer">
                {t('welcome.footer_support') || 'Support'}
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section" ref={addToRefs}>
          <h3>{t('welcome.footer_follow_us') || 'Follow Us'}</h3>
          <p>{t('welcome.footer_social_description') || 'Stay connected with the PlayScore community on social media!'}</p>
          <div className="social-links">
            <a
              href="https://twitter.com/playscore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://facebook.com/playscore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://instagram.com/playscore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://discord.gg/playscore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <i className="fab fa-discord"></i>
            </a>
            <a
              href="https://youtube.com/playscore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {t('welcome.footer_copyright', { year: currentYear }) || `© ${currentYear} PlayScore. All rights reserved.`}
        </p>
        <p className="credits">
          {t('welcome.footer_powered_by') || 'Powered by'}{' '}
          <a
            href="https://rawg.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            RAWG API
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
