import SponsorTier from './SponsorTier';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/SponsorsSection.module.css';

const SponsorsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const sponsorTiers = [
    {
      tier: 'Grant Sponsor',
      icon: '👑',
      amount: '$10,000',
      benefits: [
        'Upto VIP seats',
        'Logo on all materials',
        'Meet & greet access',
        'Recognition in service'
      ],
      themeColor: 'gold',
      delay: 0
    },
    {
      tier: 'Platinum Sponsor',
      icon: '💎',
      amount: '$5000',
      benefits: [
        '6 VIP seats',
        'Logo on programs',
        'Slides',
        'Social media mention'
      ],
      themeColor: 'platinum',
      delay: 0.15
    },
    {
      tier: 'Gold Sponsor',
      icon: '⭐',
      amount: '$2000',
      benefits: [
        '4 VIP seats',
        'Logo on programs',
        'Thank you mention',
        'Event newsletter feature'
      ],
      themeColor: 'silver',
      delay: 0.3
    },
    {
      tier: 'Silver Sponsor',
      icon: '🏅',
      amount: '$1000',
      benefits: [
        '2 priority seats',
        'Name in program',
        'Thank you certificate',
        'Event updates'
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
            href="mailto:info@spcchurch.org"
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
