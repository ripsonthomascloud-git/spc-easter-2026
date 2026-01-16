import React from 'react';
import styles from '../styles/HeroSection.module.css';

const HeroSection = () => {
  const scrollToRegistration = (e) => {
    e.preventDefault();
    const element = document.getElementById('registration');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>St. Pauls Mathoma Church, Dallas Presents</p>
          <h1 className={styles.heroTitle}>The Ultimate Sacrifice in Golgotha</h1>
          <a href="#registration" className={styles.ctaButton} onClick={scrollToRegistration}>
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
