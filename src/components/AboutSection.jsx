import React from 'react';
import EventDetail from './EventDetail';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/AboutSection.module.css';

const AboutSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const eventDetails = [
    { title: 'When', description: 'April 4th 2026' },
    { title: 'Where', description: 'Sharon Event Center, Mesquite' },
    { title: 'Time', description: 'Show begins at 6:00 PM' }
  ];

  return (
    <section ref={ref} id="about" className={`${styles.aboutSection} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>About the Event</h2>
        <div className={styles.aboutContent}>
          <p>
            Join us for a transformative Easter experience as we reflect on the ultimate sacrifice made at Golgotha.
            This sacred event will bring together our community in worship, reflection, and celebration of the resurrection.
          </p>
          <div className={styles.eventDetails}>
            {eventDetails.map((detail, index) => (
              <EventDetail key={index} title={detail.title} description={detail.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
