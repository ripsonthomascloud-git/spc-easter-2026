import React from 'react';
import styles from '../styles/AboutSection.module.css';

const EventDetail = ({ title, description }) => {
  return (
    <div className={styles.detailItem}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default EventDetail;
