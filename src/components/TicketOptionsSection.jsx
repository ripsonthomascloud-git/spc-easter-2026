import TicketCard from './TicketCard';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/TicketOptionsSection.module.css';

const TicketOptionsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const tickets = [
    {
      title: 'General Admission',
      price: '$75',
      features: [
        'Single Admission'
      ],
      isPopular: false,
      delay: 0
    },
    {
      title: 'Family Package',
      price: '$225',
      features: [
        'Admits 4 people'
      ],
      isPopular: true,
      delay: 0.3
    },
    {
      title: 'VIP Single',
      price: '$150',
      features: [
        'Premium Seating, Admits 1'
      ],
      isPopular: false,
      delay: 0.15
    },
    ,
    {
      title: 'VIP Family ',
      price: '$500',
      features: [
        'Premium Family Seating ,Admits 4'
      ],
      isPopular: false,
      delay: 0.3
    }
  ];

  const handleSelectTicket = (ticketType) => {
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const ticketSelect = document.getElementById('ticketType');
        if (ticketSelect) {
          ticketSelect.value = ticketType.toLowerCase().replace(' ', '-');
          ticketSelect.focus();
        }
      }, 800);
    }
  };

  return (
    <section
      ref={ref}
      className={`${styles.ticketSection} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Choose Your Experience</h2>
        <p className={styles.sectionSubtitle}>
          Select the ticket option that best fits your celebration
        </p>
        <div className={styles.ticketGrid}>
          {tickets.map((ticket, index) => (
            <TicketCard
              key={index}
              {...ticket}
              onSelectTicket={() => handleSelectTicket(ticket.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TicketOptionsSection;
