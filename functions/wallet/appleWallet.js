const { PKPass } = require('passkit-generator');
const path = require('path');
const fs = require('fs').promises;

/**
 * Generates an Apple Wallet pass (.pkpass file)
 * @param {Object} ticketData - The ticket data
 * @param {string} qrCodeDataUrl - The QR code data URL
 * @returns {Buffer} The .pkpass file buffer
 */
async function generateApplePass(ticketData, qrCodeDataUrl) {
  try {
    // Path to your Apple Wallet certificates
    const certPath = path.join(__dirname, '../certificates/apple');

    // Create the pass
    const pass = await PKPass.from({
      model: path.join(__dirname, '../passModels/SPC_Easter_2026.pass'),
      certificates: {
        wwdr: path.join(certPath, 'wwdr.pem'),
        signerCert: path.join(certPath, 'signerCert.pem'),
        signerKey: path.join(certPath, 'signerKey.pem'),
        signerKeyPassphrase: process.env.APPLE_PASS_PASSPHRASE || ''
      }
    });

    // Set pass data
    pass.serialNumber = ticketData.id;
    pass.description = 'SPC Easter 2026 Event Ticket';

    // Set primary fields
    pass.primaryFields.push({
      key: 'name',
      label: 'ATTENDEE',
      value: ticketData.name
    });

    // Set secondary fields
    pass.secondaryFields.push({
      key: 'ticketType',
      label: 'TICKET TYPE',
      value: ticketData.ticketType
    });

    pass.secondaryFields.push({
      key: 'tickets',
      label: 'QUANTITY',
      value: ticketData.tickets.toString()
    });

    // Set auxiliary fields
    pass.auxiliaryFields.push({
      key: 'email',
      label: 'EMAIL',
      value: ticketData.email
    });

    // Set back fields
    pass.backFields.push({
      key: 'ticketId',
      label: 'Ticket ID',
      value: ticketData.id
    });

    pass.backFields.push({
      key: 'totalAmount',
      label: 'Total Amount',
      value: ticketData.totalAmount
    });

    // Add barcode
    pass.barcodes = [{
      message: ticketData.id,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1'
    }];

    // Generate and return the buffer
    const buffer = pass.getAsBuffer();
    return buffer;

  } catch (error) {
    console.error('Error in generateApplePass:', error);
    throw new Error(`Failed to generate Apple Wallet pass: ${error.message}`);
  }
}

/**
 * Creates a simplified Apple Wallet pass without certificates (for testing)
 * This creates a basic JSON structure that can be used for development
 */
async function generateSimpleApplePass(ticketData, qrCodeDataUrl) {
  // This is a simplified version for testing purposes
  // In production, you MUST use proper Apple certificates

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: 'pass.com.spc.easter2026',
    serialNumber: ticketData.id,
    teamIdentifier: 'YOUR_TEAM_ID', // Replace with your Apple Team ID
    organizationName: 'SPC Easter 2026',
    description: 'SPC Easter 2026 Event Ticket',
    logoText: 'SPC Easter 2026',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(139, 69, 19)',
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
        }
      ]
    },
    barcode: {
      message: ticketData.id,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1'
    }
  };

  // For testing, return the JSON structure
  // Note: This won't work in actual Apple Wallet - it needs to be signed
  return Buffer.from(JSON.stringify(passJson, null, 2));
}

module.exports = {
  generateApplePass,
  generateSimpleApplePass
};
