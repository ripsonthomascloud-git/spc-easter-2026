import React, { useEffect, useRef, useState } from 'react';
import { useTicketGenerator } from '../hooks/useTicketGenerator';
import { EVENT_CONFIG, formatCurrency, getTicketTypeDisplay } from '../utils/ticketGenerator';
import { detectPlatform, supportsWallet, addToAppleWallet, addToGoogleWallet } from '../utils/walletUtils';
import styles from '../styles/TicketModal.module.css';

const TicketModal = ({ isOpen, onClose, registrationId, formData }) => {
  const { generateTicket, downloadTicket, isGenerating, qrCodeDataUrl, ticketData, error } = useTicketGenerator();
  const ticketRef = useRef(null);
  const [platform, setPlatform] = useState(null);
  const [isAddingToWallet, setIsAddingToWallet] = useState(false);

  useEffect(() => {
    // Detect platform on mount
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    if (isOpen && registrationId && formData) {
      generateTicket(registrationId, formData);
    }
  }, [isOpen, registrationId, formData, generateTicket]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (ticketRef.current) {
      try {
        await downloadTicket(ticketRef.current);
      } catch (err) {
        console.error('Download failed:', err);
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToWallet = async () => {
    if (!ticketData || !qrCodeDataUrl) {
      return;
    }

    setIsAddingToWallet(true);

    try {
      if (platform === 'ios') {
        await addToAppleWallet(ticketData, qrCodeDataUrl);
      } else if (platform === 'android') {
        await addToGoogleWallet(ticketData, qrCodeDataUrl);
      }
    } catch (err) {
      console.error('Error adding to wallet:', err);
    } finally {
      setIsAddingToWallet(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <h2>Your Ticket is Ready!</h2>
          <p>Save this ticket for event entry</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}

        {isGenerating && !ticketData && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Generating your ticket...</p>
          </div>
        )}

        {ticketData && qrCodeDataUrl && (
          <>
            <div ref={ticketRef} className={styles.ticketContainer}>
              <div className={styles.ticketHeader}>
                <h1 className={styles.eventName}>{EVENT_CONFIG.name}</h1>
                <div className={styles.eventDetails}>
                  <p className={styles.eventDate}>{EVENT_CONFIG.date}</p>
                  <p className={styles.eventTime}>{EVENT_CONFIG.time}</p>
                  <p className={styles.eventLocation}>{EVENT_CONFIG.location}</p>
                </div>
              </div>

              <div className={styles.ticketBody}>
                <div className={styles.qrCodeSection}>
                  <img
                    src={qrCodeDataUrl}
                    alt="Ticket QR Code"
                    className={styles.qrCode}
                  />
                  <p className={styles.qrLabel}>Scan at entry</p>
                </div>

                <div className={styles.attendeeDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Name</span>
                    <span className={styles.detailValue}>{ticketData.name}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>{ticketData.email}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Ticket Type</span>
                    <span className={styles.detailValue}>{getTicketTypeDisplay(ticketData.ticketType)}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Tickets</span>
                    <span className={styles.detailValue}>{ticketData.tickets}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Total</span>
                    <span className={styles.detailValue}>{formatCurrency(ticketData.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.ticketFooter}>
                <p className={styles.ticketId}>Ticket ID: {ticketData.id}</p>
                <p className={styles.footerNote}>Please bring this ticket (digital or printed) to the event</p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.downloadButton}
                onClick={handleDownload}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Download Ticket'}
              </button>

              {supportsWallet() && (
                <button
                  className={styles.walletButton}
                  onClick={handleAddToWallet}
                  disabled={isGenerating || isAddingToWallet}
                >
                  {isAddingToWallet ? (
                    'Adding...'
                  ) : platform === 'ios' ? (
                    <>
                      <svg className={styles.walletIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.17 3.25q.33 0 .59.25.25.25.25.59v15.82q0 .34-.25.59t-.59.25H2.83q-.34 0-.59-.25t-.25-.59V4.09q0-.34.25-.59t.59-.25H6V2h12v1.25zM8 7.5v9h8v-9H8zm-5 9V6H5v10.5H3zm16 0V6h2v10.5h-2z"/>
                      </svg>
                      Add to Apple Wallet
                    </>
                  ) : (
                    <>
                      <svg className={styles.walletIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.17 3.25q.33 0 .59.25.25.25.25.59v15.82q0 .34-.25.59t-.59.25H2.83q-.34 0-.59-.25t-.25-.59V4.09q0-.34.25-.59t.59-.25H6V2h12v1.25zM8 7.5v9h8v-9H8zm-5 9V6H5v10.5H3zm16 0V6h2v10.5h-2z"/>
                      </svg>
                      Add to Google Wallet
                    </>
                  )}
                </button>
              )}

              <button
                className={styles.closeButtonSecondary}
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketModal;
