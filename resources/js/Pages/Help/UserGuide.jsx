import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTranslation } from '../../lang/translationHelper';
import './UserGuide.css';

/**
 * User Guide page component
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication information including user
 * @returns {JSX.Element} User Guide page component
 */
export default function UserGuide({ auth }) {
  const { t } = useTranslation();

  // Guide sections
  const guideSections = [
    {
      id: 'dashboard-overview',
      title: t('help.dashboard_overview') || 'Dashboard Overview',
      content: t('help.dashboard_overview_content') || 'Your dashboard is your personal gaming hub. Here you can track your gaming activity, manage your wishlist, and see your rating history. The dashboard provides a comprehensive view of your gaming profile and preferences.'
    },
    {
      id: 'wishlist',
      title: t('help.wishlist') || 'Managing Your Wishlist',
      content: t('help.wishlist_content') || 'The wishlist feature allows you to save games you\'re interested in. To add a game to your wishlist, browse the games catalog and click the "Add to Wishlist" button on any game card or game details page. You can view and manage your wishlist from your dashboard.'
    },
    {
      id: 'ratings',
      title: t('help.ratings') || 'Rating Games',
      content: t('help.ratings_content') || 'Share your gaming experience by rating games you\'ve played. Your ratings help other users discover great games and also help us recommend games you might enjoy. To rate a game, visit the game details page and use the rating system to assign a score and optionally leave a review.'
    },
    {
      id: 'stats',
      title: t('help.stats') || 'Understanding Your Stats',
      content: t('help.stats_content') || 'Your stats section shows your gaming activity metrics, including games played, reviews written, wishlisted games, and liked games. These stats update automatically as you interact with games on the platform.'
    },
    {
      id: 'recommendations',
      title: t('help.recommendations') || 'Game Recommendations',
      content: t('help.recommendations_content') || 'Based on your ratings and gaming preferences, we provide personalized game recommendations. The more games you rate, the better our recommendations become. Explore the "Recommended For You" section on your dashboard to discover new games.'
    },
    {
      id: 'activity',
      title: t('help.activity') || 'Activity Charts',
      content: t('help.activity_content') || 'The activity charts visualize your gaming trends over time. The ratings distribution chart shows how you tend to rate games, while the activity chart tracks your platform engagement over time.'
    },
    {
      id: 'pdf',
      title: t('help.pdf') || 'Generating Reports',
      content: t('help.pdf_content') || 'You can generate PDF reports of your gaming profile, including your stats, ratings, and wishlist. This feature is available at the bottom of your dashboard.'
    }
  ];

  return (
    <MainLayout auth={auth} currentUrl="/help/user-guide">
      <Head title={t('help.page_title') || 'User Guide | PlayScore'} />

      <div className="user-guide-page">
        {/* Hero Section */}
        <section className="guide-hero">
          <div className="container">
            <h1 className="guide-title">{t('help.hero_title') || 'PlayScore User Guide'}</h1>
            <p className="guide-subtitle">{t('help.hero_subtitle') || 'Learn how to make the most of your PlayScore experience'}</p>
          </div>
        </section>

        {/* Guide Content */}
        <section className="guide-content">
          <div className="container">
            {/* Table of Contents */}
            <div className="toc-container">
              <h2 className="toc-title">{t('help.contents') || 'Contents'}</h2>
              <ul className="toc-list">
                {guideSections.map((section) => (
                  <li key={section.id} className="toc-item">
                    <a href={`#${section.id}`} className="toc-link">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guide Sections */}
            <div className="guide-sections">
              {guideSections.map((section) => (
                <div key={section.id} id={section.id} className="guide-section">
                  <h2 className="section-title">{section.title}</h2>
                  <div className="section-content">
                    <p>{section.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Help */}
            <div className="additional-help">
              <h2 className="section-title">{t('help.need_more_help') || 'Need More Help?'}</h2>
              <p>{t('help.contact_support') || 'If you have any questions or need further assistance, please visit our Contact page or send us an email.'}</p>
              <div className="help-actions">
                <a href="/contact" className="btn btn-primary">
                  {t('help.contact_us') || 'Contact Us'}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
