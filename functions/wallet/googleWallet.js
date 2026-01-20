const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const path = require('path');

// Google Wallet API configuration
const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID || 'YOUR_ISSUER_ID';
const CLASS_ID = 'spc-easter-2026-event';

/**
 * Generates a Google Wallet pass save URL
 * @param {Object} ticketData - The ticket data
 * @param {string} qrCodeDataUrl - The QR code data URL
 * @returns {string} The save URL for Google Wallet
 */
async function generateGooglePass(ticketData, qrCodeDataUrl) {
  try {
    // Create the event ticket class (only needs to be done once)
    const classPayload = {
      id: `${ISSUER_ID}.${CLASS_ID}`,
      issuerName: 'SPC Easter 2026',
      eventName: {
        defaultValue: {
          language: 'en-US',
          value: 'SPC Easter 2026'
        }
      },
      reviewStatus: 'UNDER_REVIEW'
    };

    // Create the event ticket object for this specific ticket
    const objectPayload = {
      id: `${ISSUER_ID}.${ticketData.id}`,
      classId: `${ISSUER_ID}.${CLASS_ID}`,
      state: 'ACTIVE',
      ticketHolderName: ticketData.name,
      ticketNumber: ticketData.id,
      barcode: {
        type: 'QR_CODE',
        value: ticketData.id
      },
      seatInfo: {
        seat: {
          defaultValue: {
            language: 'en-US',
            value: `${ticketData.ticketType} - ${ticketData.tickets} ticket(s)`
          }
        }
      },
      hexBackgroundColor: '#8B4513',
      eventId: 'spc-easter-2026'
    };

    // Create JWT for the pass
    const claims = {
      iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        eventTicketObjects: [objectPayload]
      }
    };

    // Load service account key
    const serviceAccountPath = path.join(__dirname, '../certificates/google/service-account-key.json');
    let serviceAccount;

    try {
      serviceAccount = require(serviceAccountPath);
    } catch (error) {
      console.error('Service account key not found. Using environment variable.');
      // Fallback to environment variable if file doesn't exist
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        throw new Error('Google service account credentials not configured');
      }
      serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    }

    // Sign the JWT
    const token = jwt.sign(claims, serviceAccount.private_key, {
      algorithm: 'RS256'
    });

    // Generate the save URL
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    return saveUrl;

  } catch (error) {
    console.error('Error in generateGooglePass:', error);
    throw new Error(`Failed to generate Google Wallet pass: ${error.message}`);
  }
}

/**
 * Creates a simplified Google Wallet pass URL (for testing)
 */
async function generateSimpleGooglePass(ticketData, qrCodeDataUrl) {
  // For testing purposes without full Google Wallet setup
  // This creates a basic structure

  const objectPayload = {
    id: `${ISSUER_ID}.${ticketData.id}`,
    classId: `${ISSUER_ID}.${CLASS_ID}`,
    state: 'ACTIVE',
    ticketHolderName: ticketData.name,
    ticketNumber: ticketData.id,
    barcode: {
      type: 'QR_CODE',
      value: ticketData.id
    }
  };

  // Create a simple JWT (NOTE: This won't work without proper signing)
  const claims = {
    iss: 'test@example.com',
    aud: 'google',
    typ: 'savetowallet',
    payload: {
      eventTicketObjects: [objectPayload]
    }
  };

  // In testing, you would need to properly sign this
  // For now, return a placeholder URL
  return `https://pay.google.com/gp/v/save/PLACEHOLDER_TOKEN`;
}

/**
 * Creates the event ticket class in Google Wallet API (one-time setup)
 */
async function createEventTicketClass() {
  try {
    const serviceAccountPath = path.join(__dirname, '../certificates/google/service-account-key.json');
    const serviceAccount = require(serviceAccountPath);

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/wallet_object.issuer']
    });

    const client = await auth.getClient();
    const walletobjects = google.walletobjects({ version: 'v1', auth: client });

    const classPayload = {
      id: `${ISSUER_ID}.${CLASS_ID}`,
      issuerName: 'SPC Easter 2026',
      eventName: {
        defaultValue: {
          language: 'en-US',
          value: 'SPC Easter 2026'
        }
      },
      venue: {
        name: {
          defaultValue: {
            language: 'en-US',
            value: 'Event Venue'
          }
        }
      },
      dateTime: {
        start: '2026-04-20T10:00:00Z', // Update with your event date
        end: '2026-04-20T18:00:00Z'
      },
      reviewStatus: 'UNDER_REVIEW',
      hexBackgroundColor: '#8B4513'
    };

    const response = await walletobjects.eventticketclass.insert({
      requestBody: classPayload
    });

    console.log('Event ticket class created:', response.data);
    return response.data;

  } catch (error) {
    if (error.message && error.message.includes('409')) {
      console.log('Class already exists');
      return { success: true, message: 'Class already exists' };
    }
    throw error;
  }
}

module.exports = {
  generateGooglePass,
  generateSimpleGooglePass,
  createEventTicketClass
};
