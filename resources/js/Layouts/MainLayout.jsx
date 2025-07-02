import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BackToTop from '../components/BackToTop/BackToTop';
import FlashMessageV2 from '../Components/FlashMessageV2';

const MainLayout = ({ children, auth, currentUrl }) => {
  return (
    <>
      <FlashMessageV2 />
      <Header auth={auth} currentUrl={currentUrl} />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default MainLayout;
