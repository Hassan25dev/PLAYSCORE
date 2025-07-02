import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { t } from '../lang/translationHelper';
import bloodborne from '../images/bloodborne-3840x2160-13121.jpg';
import darkSouls from '../images/dark-souls-iii-3840x2160-18750.jpg';
import halo from '../images/halo-battlefield-3840x2160-18793.jpg';
import massEffect from '../images/mass-effect-3840x2160-15572.jpg';
import theElderScrolls from '../images/the-elder-scrolls-v-3840x2160-14935.jpg';
import './About.css';

/**
 * About page component
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication information including user and locale
 * @returns {JSX.Element} About page component
 */
export default function About({ auth }) {
  // Team members data
  const teamMembers = [
    {
      name: 'HASSANE AMANAD',
      role: 'Founder & Developer',
      bio: 'Passionate developer and gaming enthusiast who created PlayScore from the ground up. Responsible for all aspects of the platform including design, development, and content management.',
      image: bloodborne
    }
  ];

  // Project journey milestones
  const milestones = [
    { year: '2023', event: 'Conception de PlayScore comme projet personnel par HASSANE AMANAD' },
    { year: '2024 (Jan)', event: 'Début du développement avec Laravel et React' },
    { year: '2024 (Mar)', event: 'Intégration de l\'API RAWG pour accéder à une vaste bibliothèque de jeux' },
    { year: '2024 (Apr)', event: 'Développement des fonctionnalités de base: navigation, recherche et affichage des jeux' },
    { year: '2024 (May)', event: 'Lancement de la première version de PlayScore avec système d\'évaluation et de critique' }
  ];

  return (
    <MainLayout auth={auth} currentUrl="/about">
      <Head title={t('about_page.page_title')} />

      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${theElderScrolls})` }}>
          <div className="container">
            <h1 className="about-title">{t('about_page.hero_title')}</h1>
            <p className="about-subtitle">{t('about_page.hero_subtitle')}</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section mission-section">
          <div className="container">
            <div className="section-content">
              <h2 className="section-title">{t('about_page.mission_title')}</h2>
              <p className="section-text">
                {t('about_page.mission_text_1')}
              </p>
              <p className="section-text">
                {t('about_page.mission_text_2')}
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section values-section">
          <div className="container">
            <h2 className="section-title">{t('about_page.values_title')}</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🎮</div>
                <h3 className="value-title">{t('about_page.value_authenticity')}</h3>
                <p className="value-text">{t('about_page.value_authenticity_desc')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">👥</div>
                <h3 className="value-title">{t('about_page.value_community')}</h3>
                <p className="value-text">{t('about_page.value_community_desc')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔍</div>
                <h3 className="value-title">{t('about_page.value_discovery')}</h3>
                <p className="value-text">{t('about_page.value_discovery_desc')}</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌐</div>
                <h3 className="value-title">{t('about_page.value_accessibility')}</h3>
                <p className="value-text">{t('about_page.value_accessibility_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section team-section">
          <div className="container">
            <h2 className="section-title">{t('about_page.creator_title')}</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div className="team-card" key={index}>
                  <div className="team-image" style={{ backgroundImage: `url(${member.image})` }}></div>
                  <div className="team-info">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <p className="team-bio">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="about-section history-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${darkSouls})` }}>
          <div className="container">
            <h2 className="section-title">{t('about_page.journey_title')}</h2>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-content">
                    <p>{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-section stats-section">
          <div className="container">
            <h2 className="section-title">{t('about_page.stats_title')}</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">300+</div>
                <div className="stat-label">{t('about_page.dev_hours')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">20K+</div>
                <div className="stat-label">{t('about_page.games_accessible')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">{t('about_page.platforms_count')}</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">{t('about_page.passion')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="about-section join-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bloodborne})` }}>
          <div className="container">
            <h2 className="section-title">{t('about_page.join_title')}</h2>
            <p className="section-text">
              {t('about_page.join_text')}
            </p>
            <div className="join-buttons">
              <a href="/register" className="btn btn-primary">{t('about_page.sign_up')}</a>
              <a href="/contact" className="btn btn-secondary">{t('about_page.contact_me')}</a>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}