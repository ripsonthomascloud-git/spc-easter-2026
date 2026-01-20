/**
 * Detects the user's platform
 * @returns {'ios' | 'android' | 'other'}
 */
export function detectPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }

  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  return 'other';
}

/**
 * Checks if the device supports wallet functionality
 * @returns {boolean}
 */
export function supportsWallet() {
  const platform = detectPlatform();
  return platform === 'ios' || platform === 'android';
}

/**
 * Generates Apple Wallet pass data
 * @param {Object} ticketData - The ticket data
 * @param {string} qrCodeDataUrl - The QR code data URL
 * @returns {Object} Pass data for Apple Wallet
 */
export function generateApplePassData(ticketData, qrCodeDataUrl) {
  // This creates the pass.json structure for Apple Wallet
  // Note: Actual .pkpass files need to be signed on the backend
  return {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.spc.easter2026',
    serialNumber: ticketData.id,
    teamIdentifier: 'YOUR_TEAM_ID',
    organizationName: 'SPC Easter 2026',
    description: 'SPC Easter 2026 Event Ticket',
    logoText: 'SPC Easter 2026',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(60, 65, 76)',
    eventTicket: {
      primaryFields: [
        {
          key: 'name',
          label: 'ATTENDEE',
          value: ticketData.name
        }
      ],
      secondaryFields: [
        {
          key: 'ticketType',
          label: 'TICKET TYPE',
          value: ticketData.ticketType
        },
        {
          key: 'tickets',
          label: 'QUANTITY',
          value: ticketData.tickets.toString()
        }
      ],
      auxiliaryFields: [
        {
          key: 'email',
          label: 'EMAIL',
          value: ticketData.email
        }
      ],
      backFields: [
        {
          key: 'ticketId',
          label: 'Ticket ID',
          value: ticketData.id
        },
        {
          key: 'totalAmount',
          label: 'Total Amount',
          value: ticketData.totalAmount
        },
        {
          key: 'terms',
          label: 'Terms and Conditions',
          value: 'Please bring this ticket (digital or printed) to the event'
        }
      ]
    },
    barcode: {
      message: ticketData.id,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1'
    }
  };
}

/**
 * Generates Google Wallet pass data
 * @param {Object} ticketData - The ticket data
 * @param {string} qrCodeDataUrl - The QR code data URL
 * @returns {Object} Pass data for Google Wallet
 */
export function generateGooglePassData(ticketData, qrCodeDataUrl) {
  // This creates the structure for Google Wallet
  // Note: Actual Google Wallet passes need to be signed with JWT on the backend
  return {
    iss: 'spc-easter-2026@example.com',
    aud: 'google',
    typ: 'savetowallet',
    payload: {
      eventTicketObjects: [
        {
          id: `${ticketData.id}`,
          classId: 'spc-easter-2026-event',
          state: 'ACTIVE',
          ticketHolderName: ticketData.name,
          ticketNumber: ticketData.id,
          barcode: {
            type: 'QR_CODE',
            value: ticketData.id
          },
          eventName: {
            defaultValue: {
              language: 'en-US',
              value: 'SPC Easter 2026'
            }
          },
          seatInfo: {
            seat: {
              defaultValue: {
                language: 'en-US',
                value: `${ticketData.ticketType} - ${ticketData.tickets} ticket(s)`
              }
            }
          },
          ticketType: {
            defaultValue: {
              language: 'en-US',
              value: ticketData.ticketType
            }
          }
        }
      ]
    }
  };
}

/**
 * Initiates Apple Wallet pass download
 * @param {Object} ticketData - The ticket data
 * @param {string} qrCodeDataUrl - The QR code data URL
 */
export async function addToAppleWallet(ticketData, qrCodeDataUrl) {
  try {
    // In a production environment, this would call your backend API
    // The backend would generate and sign the .pkpass file
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/wallet';

    const response = await fetch(`${apiUrl}/api/wallet/apple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketData,
        qrCodeDataUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Apple Wallet pass');
    }

    // Download the .pkpass file
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spc-easter-2026-${ticketData.id}.pkpass`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error adding to Apple Wallet:', error);

    // Fallback: Show instructions to manually add
    alert(
      'To add this ticket to Apple Wallet:\n\n' +
      '1. Download the ticket image\n' +
      '2. Open the Photos app\n' +
      '3. Select the ticket image\n' +
      '4. Tap the share button\n' +
      '5. Look for "Add to Wallet" option (if available)\n\n' +
      'Alternatively, take a screenshot of your ticket for easy access.'
    );

    return { success: false, error: error.message };
  }
}

/**
 * Initiates Google Wallet pass download
 * @param {Object} ticketData - The ticket data
 * @param {string} qrCodeDataUrl - The QR code data URL
 */
export async function addToGoogleWallet(ticketData, qrCodeDataUrl) {
  try {
    // In a production environment, this would call your backend API
    // The backend would generate a signed JWT and create the Google Wallet link
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/YOUR-PROJECT-ID/us-central1/wallet';

    const response = await fetch(`${apiUrl}/api/wallet/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticketData,
        qrCodeDataUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Google Wallet pass');
    }

    const data = await response.json();

    // Open the Google Wallet save URL
    if (data.saveUrl) {
      window.open(data.saveUrl, '_blank');
      return { success: true };
    }

    throw new Error('No save URL received');
  } catch (error) {
    console.error('Error adding to Google Wallet:', error);

    // Fallback: Show instructions
    alert(
      'To save this ticket for easy access:\n\n' +
      '1. Download the ticket image\n' +
      '2. Save it to your device\n' +
      '3. You can access it from your Photos/Gallery\n\n' +
      'Google Wallet integration requires backend setup.'
    );

    return { success: false, error: error.message };
  }
}
