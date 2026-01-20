import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2026 St. Pauls Marthoma Church. All rights reserved.</p>
        <p>For questions, please contact us at stpmtcdallas@outlook.com</p>
      </div>
    </footer>
  );
};

export default Footer;
