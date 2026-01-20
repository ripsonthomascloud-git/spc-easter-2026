import PropTypes from 'prop-types';
import styles from '../styles/SponsorsSection.module.css';

const SponsorTier = ({
  tier,
  icon,
  amount,
  benefits,
  themeColor,
  delay = 0
}) => {
  const handleBecomeSponsor = () => {
    const email = 'stpmtcdallas@outlook.com';
    const subject = `${tier} Sponsorship Inquiry - Easter 2026`;
    const body = `Hello,\n\nI am interested in becoming a ${tier} for the SPC Easter 2026 event.\n\nPlease provide more information about the sponsorship opportunities.\n\nThank you!`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div
      className={`${styles.sponsorCard} ${styles[themeColor]}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={styles.tierHeader}>
        <div className={styles.iconWrapper}>
          <span className={styles.tierIcon}>{icon}</span>
        </div>
        <h3 className={styles.tierTitle}>{tier}</h3>
        <p className={styles.tierAmount}>{amount}</p>
      </div>
      <ul className={styles.benefitList}>
        {benefits.map((benefit, index) => (
          <li key={index} className={styles.benefit}>
            <span className={styles.bulletPoint}>•</span>
            {benefit}
          </li>
        ))}
      </ul>
      <button
        className={styles.sponsorButton}
        onClick={handleBecomeSponsor}
      >
        Become a Sponsor
      </button>
    </div>
  );
};

SponsorTier.propTypes = {
  tier: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.string).isRequired,
  themeColor: PropTypes.oneOf(['gold', 'platinum', 'silver', 'bronze']).isRequired,
  delay: PropTypes.number
};

export default SponsorTier;
