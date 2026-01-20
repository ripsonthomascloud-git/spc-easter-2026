import SponsorTier from './SponsorTier';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/SponsorsSection.module.css';

const SponsorsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const sponsorTiers = [
    {
      tier: 'Grand Sponsor',
      icon: '👑',
      amount: '$5,000',
      benefits: [
        'VIP Seats for the family',
        '5 minutes stage time',
        '5 mins ad time on LED wall',
        'Appreciation Plaque'
      ],
      themeColor: 'gold',
      delay: 0
    },
    {
      tier: 'Platinum Sponsor',
      icon: '💎',
      amount: '$3000',
      benefits: [
        'Upto 4 VIP seats',
        '3 minutes stage time',
        'Static slides',
        'Website mention'
      ],
      themeColor: 'platinum',
      delay: 0.15
    },
    {
      tier: 'Gold Sponsor',
      icon: '⭐',
      amount: '$2000',
      benefits: [
        'Upto 2 VIP seats',
        'Flier priority mentions',
        'Thank you mention',
        'Event booklet half page'
      ],
      themeColor: 'silver',
      delay: 0.3
    },
    {
      tier: 'Silver Sponsor',
      icon: '🏅',
      amount: '$1000',
      benefits: [
        '2 Priority seats',
        '1 slide',
        'Flier mentions',
        'Event booklet quarter page'
      ],
      themeColor: 'bronze',
      delay: 0.45
    }
  ];

  return (
    <section
      ref={ref}
      className={`${styles.sponsorSection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Partner With Us</h2>
        <p className={styles.sectionSubtitle}>
          Support our Easter celebration and make a lasting impact in our community
        </p>
        <div className={styles.sponsorGrid}>
          {sponsorTiers.map((sponsor, index) => (
            <SponsorTier key={index} {...sponsor} />
          ))}
        </div>
        <div className={styles.contactCTA}>
          <p className={styles.ctaText}>
            Interested in a custom sponsorship package?
          </p>
          <a
            href="mailto:stpmtcdallas@outlook.com"
            className={styles.ctaLink}
          >
            Contact us at stpmtcdallas@outlook.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
