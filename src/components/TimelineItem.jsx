import React from 'react';
import styles from '../styles/ProgramSection.module.css';

const TimelineItem = ({ time, title, description }) => {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineMarker}></div>
      <div className={styles.timelineContent}>
        <h3>{time} - {title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default TimelineItem;
