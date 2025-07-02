import React from 'react';

const CategoryBanner = () => {
  return (
    <div style={{
      height: '250px',
      marginBottom: '3rem',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #1a1e21, #2c3e50)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 30%, rgba(0, 112, 243, 0.15) 0%, transparent 40%)',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'relative',
        zIndex: 2
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '3.5rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          background: 'linear-gradient(90deg, #0070f3, #00b8d9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Catégories de Jeux
        </h1>
        <p style={{
          color: '#e0e0e0',
          fontSize: '1.2rem',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Explorez les jeux par genre et découvrez de nouvelles expériences
        </p>
      </div>
      
      {/* Game controller icon */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '30px',
        fontSize: '2.5rem',
        opacity: '0.2',
        color: '#0070f3'
      }}>
        🎮
      </div>
    </div>
  );
};

export default CategoryBanner;