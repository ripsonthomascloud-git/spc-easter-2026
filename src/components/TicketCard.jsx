import PropTypes from 'prop-types';
import styles from '../styles/TicketOptionsSection.module.css';

const TicketCard = ({
  title,
  price,
  features,
  isPopular = false,
  delay = 0,
  onSelectTicket
}) => {
  return (
    <div
      className={`${styles.ticketCard} ${isPopular ? styles.popular : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {isPopular && (
        <div className={styles.popularBadge}>
          Most Popular
        </div>
      )}
      <div className={styles.cardHeader}>
        <h3 className={styles.ticketTitle}>{title}</h3>
        <div className={styles.priceTag}>
          <span className={styles.price}>{price}</span>
          {/* {title === 'Family Package' && (
            <span className={styles.priceNote}>per family</span>
          )} */}
        </div>
      </div>
      <ul className={styles.featureList}>
        {features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <span className={styles.checkmark}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`${styles.selectButton} ${isPopular ? styles.popularButton : ''}`}
        onClick={onSelectTicket}
      >
        Select Ticket
      </button>
    </div>
  );
};

TicketCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  isPopular: PropTypes.bool,
  delay: PropTypes.number,
  onSelectTicket: PropTypes.func.isRequired
};

export default TicketCard;
