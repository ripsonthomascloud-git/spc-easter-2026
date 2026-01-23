import React, { useEffect, useRef, useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useFormValidation } from '../hooks/useFormValidation';
import TicketModal from './TicketModal';
import styles from '../styles/RegistrationSection.module.css';

const RegistrationSection = () => {
  const { loading, error, success, submitRegistration, resetState } = useFirebase();
  const formMessageRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState('zelle'); // 'zelle', 'venmo', or 'credit-card'
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [pendingCreditCardRedirect, setPendingCreditCardRedirect] = useState(false);

  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketType: 'general-admission',
    tickets: 1,
    specialNeeds: '',
    newsletter: false
  };

  const {
    formData,
    errors,
    handleChange,
    handlePhoneChange,
    validate,
    resetForm
  } = useFormValidation(initialFormState);

  // Calculate total payment
  const calculateTotal = () => {
    const ticketPrices = {
      'general-admission': 60,
      'vip-single': 150,
      'family-package': 200,
      'vip-family-package': 500
    };

    const basePrice = ticketPrices[formData.ticketType] || 0;
    const numTickets = parseInt(formData.tickets);

    // For family packages, price is flat. For individual tickets, multiply by number of tickets
    if (formData.ticketType === 'family-package' || formData.ticketType === 'vip-family-package') {
      return basePrice;
    } else {
      return basePrice * numTickets;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    resetState();

    // Calculate actual number of tickets based on ticket type
    const calculateTicketCount = () => {
      const numTickets = parseInt(formData.tickets);

      // Family packages: multiply by 4
      if (formData.ticketType === 'family-package' || formData.ticketType === 'vip-family-package') {
        return numTickets * 4;
      }

      // General admission and VIP single: use as-is
      return numTickets;
    };

    // Prepare submission data with payment method and total
    const submissionData = {
      ...formData,
      tickets: calculateTicketCount(), // Override with calculated ticket count
      paymentMethod: paymentMethod,
      totalAmount: calculateTotal()
    };

    const result = await submitRegistration(submissionData);

    if (result.success) {
      // Store ticket data with full name for the ticket
      const ticketFormData = {
        ...submissionData,
        name: `${formData.firstName} ${formData.lastName}`
      };

      setTicketData({ id: result.id, formData: ticketFormData });
      setShowTicketModal(true);

      // If credit card is selected, mark for redirect after modal closes
      if (paymentMethod === 'credit-card') {
        setPendingCreditCardRedirect(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowTicketModal(false);
    setTicketData(null);

    // If credit card redirect is pending, redirect now
    if (pendingCreditCardRedirect) {
      window.location.href = 'https://www.zeffy.com/en-US/ticketing/the-ultimate-sacrifice-in-golgotha';
      return;
    }

    // Otherwise, reset form and show success message
    resetForm();
    setPaymentMethod('zelle');

    // Scroll to success message
    setTimeout(() => {
      if (formMessageRef.current) {
        formMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  return (
    <section id="registration" className={styles.registrationSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Event Registration</h2>
        <p className={styles.registrationIntro}>
          Pre-register for the Easter 2026 event to help us prepare for your attendance
        </p>

        <form onSubmit={handleSubmit} className={styles.registrationForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={errors.firstName ? styles.inputError : ''}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={errors.lastName ? styles.inputError : ''}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ticketType">Ticket Type *</label>
            <select
              id="ticketType"
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              required
            >
              <option value="general-admission">General Admission - $60</option>
              <option value="vip-single">VIP Experience Single - $150</option>
              <option value="family-package">Family Package - $200 per family</option>
              <option value="vip-family-package">VIP Family Package - $500 per family</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tickets">Number of Tickets *</label>
            <input
              type="number"
              id="tickets"
              name="tickets"
              value={formData.tickets}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="specialNeeds">Special Needs or Requests</label>
            <textarea
              id="specialNeeds"
              name="specialNeeds"
              value={formData.specialNeeds}
              onChange={handleChange}
              rows="4"
              placeholder="Please let us know if you have any special requirements"
            />
          </div>

          {/* Payment Method Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod">Payment Method *</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="zelle">Zelle</option>
              <option value="venmo">Venmo</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="credit-card">Credit Card</option>
            </select>
          </div>

          {/* Payment Instructions */}
          <div className={styles.paymentInstructions}>
            <h3>Payment Instructions</h3>
            <div className={styles.instructionsContent}>
              <p><strong>Zelle:</strong> stpaulschoir.treasurer@ gmail.com</p>
              <p><strong>Venmo:</strong> @stpaulschoir</p>
              <p><strong>Cash/Check:</strong> Pay in Person, payable to <b>St. Pauls MTC Choir</b></p>
              {paymentMethod === 'credit-card' && (
                <p className={styles.creditCardNote}>
                  <em><strong>Credit Card:</strong>You will be redirected to our secure payment portal to complete your credit card payment.</em>
                </p>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className={styles.paymentSummary}>
            <h3>Payment Summary</h3>
            <div className={styles.summaryRow}>
              <span>Ticket Type:</span>
              <span>{formData.ticketType === 'general-admission' ? 'General Admission' :
                     formData.ticketType === 'vip-single' ? 'VIP Experience Single' :
                     formData.ticketType === 'family-package' ? 'Family Package' : 'VIP Family Package'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Number of Tickets:</span>
              <span>{formData.tickets}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span><strong>Total Amount:</strong></span>
              <span><strong>${calculateTotal()}</strong></span>
            </div>
          </div>


          <button type="submit" className={styles.submitButton} disabled={loading}>
            <span className={styles.buttonText}>
              {loading ? 'Processing...' : 'Complete Registration'}
            </span>
            {loading && <span className={styles.buttonLoader}></span>}
          </button>

          {(success || error) && (
            <div
              ref={formMessageRef}
              className={`${styles.formMessage} ${success ? styles.success : styles.error}`}
            >
              {success
                ? 'Registration completed successfully! We look forward to seeing you at the event.'
                : error}
            </div>
          )}
        </form>
      </div>

      <TicketModal
        isOpen={showTicketModal}
        onClose={handleCloseModal}
        registrationId={ticketData?.id}
        formData={ticketData?.formData}
      />
    </section>
  );
};

export default RegistrationSection;
