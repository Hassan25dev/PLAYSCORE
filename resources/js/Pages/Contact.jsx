import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { t } from '../lang/translationHelper';
import battlefield from '../images/battlefield-2042-3840x2160-19448.jpg';
import ghostrunner from '../images/ghostrunner-video-3840x2160-15242.jpg';
import helldivers from '../images/helldivers-2-video-3840x2160-15526.jpg';
import sekiro from '../images/sekiro-shadows-die-3840x2160-14176.jpg';
import './Contact.css';

/**
 * Contact page component
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication information including user and locale
 * @returns {JSX.Element} Contact page component
 */
export default function Contact({ auth }) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  // FAQ items
  const faqItems = [
    {
      question: 'Comment puis-je soumettre un jeu pour évaluation?',
      answer: 'Pour soumettre un jeu à évaluer, vous devez créer un compte et accéder à la section "Soumettre un jeu" dans votre profil. Remplissez les informations requises sur le jeu et je l\'ajouterai à la plateforme.'
    },
    {
      question: 'Comment les notes des jeux sont-elles calculées?',
      answer: 'Les notes des jeux sont calculées sur la base d\'une moyenne pondérée des avis des utilisateurs. Le système prend en compte des facteurs tels que le nombre d\'avis et la qualité des critiques pour assurer des évaluations justes.'
    },
    {
      question: 'Puis-je modifier ou supprimer mon avis?',
      answer: 'Oui, vous pouvez modifier ou supprimer vos avis à tout moment depuis votre page de profil. Accédez simplement à la section de vos avis et sélectionnez celui que vous souhaitez modifier.'
    },
    {
      question: 'Comment signaler un contenu inapproprié?',
      answer: 'Si vous rencontrez un contenu inapproprié, veuillez utiliser le bouton "Signaler" disponible sur tous les avis et commentaires. Je traiterai le signalement et prendrai les mesures appropriées.'
    },
    {
      question: 'PlayScore utilise-t-il une API externe?',
      answer: 'Oui, PlayScore utilise l\'API RAWG pour accéder à une vaste bibliothèque de jeux et d\'informations. Cela permet d\'offrir un contenu riche et à jour sur les jeux vidéo du monde entier.'
    }
  ];

  // Office locations
  const officeLocations = [
    {
      city: 'Montreal',
      address: '123 Gaming Boulevard, Montreal, QC H2X 1Y6',
      phone: '+1 (514) 555-1234',
      email: 'montreal@playscore.com',
      image: battlefield
    },
    {
      city: 'Paris',
      address: '45 Rue des Jeux Vidéo, 75001 Paris, France',
      phone: '+33 1 23 45 67 89',
      email: 'paris@playscore.com',
      image: ghostrunner
    },
    {
      city: 'Tokyo',
      address: '7-1 Gaming District, Shibuya, Tokyo 150-0002, Japan',
      phone: '+81 3 1234 5678',
      email: 'tokyo@playscore.com',
      image: helldivers
    }
  ];

  return (
    <MainLayout auth={auth} currentUrl="/contact">
      <Head title={t('contact_page.page_title')} />

      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${sekiro})` }}>
          <div className="container">
            <h1 className="contact-title">{t('contact_page.hero_title')}</h1>
            <p className="contact-subtitle">{t('contact_page.hero_subtitle')}</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-section form-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <h2 className="section-title">{t('contact_page.contact_me')}</h2>
                <p className="info-text">
                  {t('contact_page.contact_info')}
                </p>

                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon">📧</div>
                    <div className="method-details">
                      <h3>{t('contact_page.email_section')}</h3>
                      <p>hassane.amanad@playscore.com</p>
                      <p>contact@playscore.com</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">📱</div>
                    <div className="method-details">
                      <h3>{t('contact_page.phone_section')}</h3>
                      <p>+212 6XX-XXXXXX</p>
                      <p>{t('contact_page.available_by_appointment')}</p>
                    </div>
                  </div>

                  <div className="contact-method">
                    <div className="method-icon">💬</div>
                    <div className="method-details">
                      <h3>{t('contact_page.social_section')}</h3>
                      <div className="social-links">
                        <a href="https://twitter.com/playscore" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://facebook.com/playscore" target="_blank" rel="noopener noreferrer">Facebook</a>
                        <a href="https://instagram.com/playscore" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://discord.gg/playscore" target="_blank" rel="noopener noreferrer">Discord</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-form-container">
                <h2 className="form-title">{t('contact_page.form_title')}</h2>

                {submitSuccess && (
                  <div className="success-message">
                    <p>{t('contact_page.success_message')}</p>
                  </div>
                )}

                {submitError && (
                  <div className="error-message">
                    <p>{t('contact_page.error_message')}</p>
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">{t('contact_page.form_name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('contact_page.form_name_placeholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">{t('contact_page.form_email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('contact_page.form_email_placeholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">{t('contact_page.form_subject')}</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact_page.form_subject_placeholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">{t('contact_page.form_message')}</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder={t('contact_page.form_message_placeholder')}
                      rows="5"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('contact_page.sending') : t('contact_page.send_message')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="contact-section locations-section">
          <div className="container">
            <h2 className="section-title">{t('contact_page.tech_section_title')}</h2>
            <div className="locations-grid">
             <div className="location-card">
                <div className="location-image" style={{ backgroundImage: `url(${battlefield})` }}></div>
                <div className="location-info">
                  <h3 className="location-city">{t('contact_page.frontend')}</h3>
                  <p className="location-address">React, Redux, Inertia.js</p>
                  <p className="location-phone">HTML5, CSS3, JavaScript</p>
                  <p className="location-email">Responsive Design</p>
                </div>
              </div>
              <div className="location-card">
                 <div className="location-image" style={{ backgroundImage: `url(${ghostrunner})` }}></div>
                <div className="location-info">
                  <h3 className="location-city">{t('contact_page.backend')}</h3>
                  <p className="location-address">Laravel, PHP</p>
                  <p className="location-phone">MySQL Database</p>
                  <p className="location-email">RESTful API</p>
                </div>
              </div>
              <div className="location-card">
                <div className="location-image" style={{ backgroundImage: `url(${helldivers})` }}></div>
                <div className="location-info">
                  <h3 className="location-city">{t('contact_page.integrations')}</h3>
                  <p className="location-address">RAWG API</p>
                  <p className="location-phone">Authentification Sécurisée</p>
                  <p className="location-email">Système de Notation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-section faq-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${battlefield})` }}>
          <div className="container">
            <h2 className="section-title">{t('contact_page.faq_title')}</h2>
            <div className="faq-container">
              {faqItems.map((item, index) => (
                <div className="faq-item" key={index}>
                  <h3 className="faq-question">{item.question}</h3>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              ))}
            </div>
            <div className="more-questions">
              <p>{t('contact_page.more_questions')}</p>
              <a href="mailto:hassane.amanad@playscore.com" className="btn btn-primary">{t('contact_page.send_email')}</a>
            </div>
          </div>
        </section>

        {/* Future Plans Section */}
        <section className="contact-section map-section">
          <div className="map-placeholder">
            <div className="map-overlay">
              <h3>{t('contact_page.future_plans')}</h3>
              <p>{t('contact_page.future_plans_desc')}</p>
              <button className="btn btn-secondary">{t('contact_page.stay_tuned')}</button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}