import React from 'react';
import TimelineItem from './TimelineItem';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/ProgramSection.module.css';

const ProgramSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const programItems = [
    {
      time: '6:00 PM',
      title: 'Registration',
      description: 'Registratioon Counter Opens'
    },
    {
      time: '6:30 PM',
      title: 'Sponsors Event',
      description: 'Event for Sponsors'
    },
    {
      time: '7:00 PM',
      title: 'Show Begins',
      description: 'Experience the ultimate sacrifice of Cross'
    },
    {
      time: '9:00 PM',
      title: 'Dinner and Fellowship',
      description: 'Join us for refreshments and fellowship'
    }
  ];

  return (
    <section ref={ref} id="program" className={`${styles.programSection} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Event Program</h2>
        <div className={styles.programTimeline}>
          {programItems.map((item, index) => (
            <TimelineItem
              key={index}
              time={item.time}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
