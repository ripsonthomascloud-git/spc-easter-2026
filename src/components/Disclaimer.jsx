import React from 'react';
import styles from '../styles/Disclaimer.module.css';

const Disclaimer = () => {
  return (
    <section className={styles.disclaimer}>
      <div className={styles.container}>
        <p className={styles.disclaimerText}>
          All ticket sales are final; no refunds, exchanges, or chargebacks. St. Paul's Marthoma Church,
          its volunteers, and sponsors are not liable for any loss, injury, or claims arising from attendance
          or event changes. The Church reserves the right to modify, postpone, or cancel the program at its
          sole discretion. By purchasing a ticket or attending, guests accept all associated risks and waive
          all related claims.
        </p>
        <p className={styles.eventInfo}>
          April 4, 2026 — Sharon Event Center, Mesquite, TX.
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
