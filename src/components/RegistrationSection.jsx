import React, { useEffect, useRef } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useFormValidation } from '../hooks/useFormValidation';
import styles from '../styles/RegistrationSection.module.css';

const RegistrationSection = () => {
  const { loading, error, success, submitRegistration, resetState } = useFirebase();
  const formMessageRef = useRef(null);

  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketType: 'general-admission',
    adults: 1,
    children: 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    resetState();

    const result = await submitRegistration(formData);

    if (result.success) {
      resetForm();

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
              <option value="vip-experience">VIP Experience Single- $125</option>
              <option value="family-package">Family Package - $150 per family</option>
               <option value="family-package">VIP Family Package - $500 per family</option>

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
              {loading ? 'Submitting...' : 'Complete Registration'}
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
