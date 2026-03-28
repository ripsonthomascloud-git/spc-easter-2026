import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/SponsorsSlider.module.css';

const SponsorsSlider = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const sponsors = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg',
    '/6.jpg',
    '/7.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [sponsors.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sponsors.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
  };

  return (
    <section
      ref={ref}
      className={`${styles.sponsorsSlider} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Sponsors</h2>

        <div className={styles.sliderContainer}>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={goToPrevious}
            aria-label="Previous sponsor"
          >
            ‹
          </button>

          <div className={styles.slideWrapper}>
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === currentIndex ? styles.active : ''
                }`}
              >
                <img
                  src={sponsor}
                  alt={`Sponsor ${index + 1}`}
                  className={styles.sponsorImage}
                />
              </div>
            ))}
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={goToNext}
            aria-label="Next sponsor"
          >
            ›
          </button>
        </div>

        <div className={styles.indicators}>
          {sponsors.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentIndex ? styles.activeIndicator : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to sponsor ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSlider;
