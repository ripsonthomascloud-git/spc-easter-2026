import React, { useEffect, useRef } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useFormValidation } from '../hooks/useFormValidation';
import styles from '../styles/RegistrationSection.module.css';

const RegistrationSection = () => {
  const { loading, error, success, submitRegistration, resetState } = useFirebase();
  const formMessageRef = useRef(null);
  const [paymentOption, setPaymentOption] = React.useState('pay-later'); // 'pay-now' or 'pay-later'

  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketType: 'general-admission',
    adults: 1,
    children: 0,
    specialNeeds: '',
    newsletter: false,
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
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
      'general-admission': 50,
      'vip-experience': 125,
      'family-package': 150,
      'vip-family-package': 500
    };

    const basePrice = ticketPrices[formData.ticketType] || 0;
    const totalPeople = parseInt(formData.adults) + parseInt(formData.children);

    // For family packages, price is flat. For individual tickets, multiply by total people
    if (formData.ticketType === 'family-package' || formData.ticketType === 'vip-family-package') {
      return basePrice;
    } else {
      return basePrice * totalPeople;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    resetState();

    // Prepare submission data with payment option and total
    const submissionData = {
      ...formData,
      paymentOption: paymentOption,
      totalAmount: calculateTotal()
    };

    // If paying later, don't send credit card details
    if (paymentOption === 'pay-later') {
      delete submissionData.cardholderName;
      delete submissionData.cardNumber;
      delete submissionData.expiryDate;
      delete submissionData.cvv;
    }

    const result = await submitRegistration(submissionData);

    if (result.success) {
      resetForm();
      setPaymentOption('pay-later'); // Reset to default

      // Scroll to success message
      setTimeout(() => {
        if (formMessageRef.current) {
          formMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
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
              <option value="general-admission">General Admission - $50</option>
              <option value="vip-experience">VIP Experience Single - $125</option>
              <option value="family-package">Family Package - $150 per family</option>
              <option value="vip-family-package">VIP Family Package - $500 per family</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="adults">Number of Adults</label>
              <input
                type="number"
                id="adults"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="children">Number of Children</label>
              <input
                type="number"
                id="children"
                name="children"
                value={formData.children}
                onChange={handleChange}
                min="0"
              />
            </div>
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

          {/* Payment Option Selection */}
          <div className={styles.paymentOptionSection}>
            <h3>Payment Options</h3>
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOptionCard} ${paymentOption === 'pay-now' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="pay-now"
                  checked={paymentOption === 'pay-now'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <div className={styles.optionContent}>
                  <strong>Complete Registration - Pay Now</strong>
                  <p>Pay securely online and confirm your spot immediately</p>
                </div>
              </label>

              <label className={`${styles.paymentOptionCard} ${paymentOption === 'pay-later' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  name="paymentOption"
                  value="pay-later"
                  checked={paymentOption === 'pay-later'}
                  onChange={(e) => setPaymentOption(e.target.value)}
                />
                <div className={styles.optionContent}>
                  <strong>Register Now - Pay Later</strong>
                  <p>Reserve your spot and pay at the event or later</p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Summary */}
          <div className={styles.paymentSummary}>
            <h3>Payment Summary</h3>
            <div className={styles.summaryRow}>
              <span>Ticket Type:</span>
              <span>{formData.ticketType === 'general-admission' ? 'General Admission' :
                     formData.ticketType === 'vip-experience' ? 'VIP Experience Single' :
                     formData.ticketType === 'family-package' ? 'Family Package' : 'VIP Family Package'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Number of People:</span>
              <span>{parseInt(formData.adults) + parseInt(formData.children)} ({formData.adults} Adults, {formData.children} Children)</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span><strong>Total Amount:</strong></span>
              <span><strong>${calculateTotal()}</strong></span>
            </div>
          </div>

          {/* Credit Card Details - Only show for Pay Now option */}
          {paymentOption === 'pay-now' && (
            <div className={styles.paymentSection}>
              <h3>Payment Information</h3>

              <div className={styles.formGroup}>
                <label htmlFor="cardholderName">Cardholder Name *</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  required
                  placeholder="Name as it appears on card"
                  className={errors.cardholderName ? styles.inputError : ''}
                />
                {errors.cardholderName && <span className={styles.errorText}>{errors.cardholderName}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number *</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? styles.inputError : ''}
                />
                {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    placeholder="MM/YY"
                    maxLength="5"
                    className={errors.expiryDate ? styles.inputError : ''}
                  />
                  {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvv ? styles.inputError : ''}
                  />
                  {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {/* <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
            <label>
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
              />
              <span>I would like to receive updates about future church events</span>
            </label> */}
          {/* </div> */}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            <span className={styles.buttonText}>
              {loading
                ? (paymentOption === 'pay-now' ? 'Processing Payment...' : 'Submitting Registration...')
                : (paymentOption === 'pay-now' ? 'Complete Registration - Pay Now' : 'Register Now - Pay Later')
              }
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
    </section>
  );
};

export default RegistrationSection;
