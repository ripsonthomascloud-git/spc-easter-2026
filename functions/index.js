const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { generateApplePass } = require('./wallet/appleWallet');
const { generateGooglePass } = require('./wallet/googleWallet');

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Wallet API is running' });
});

// Apple Wallet endpoint
app.post('/api/wallet/apple', async (req, res) => {
  try {
    const { ticketData, qrCodeDataUrl } = req.body;

    if (!ticketData || !qrCodeDataUrl) {
      return res.status(400).json({
        error: 'Missing required fields: ticketData and qrCodeDataUrl'
      });
    }

    // Generate Apple Wallet pass
    const passBuffer = await generateApplePass(ticketData, qrCodeDataUrl);

    // Set appropriate headers for .pkpass file
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', `attachment; filename="spc-easter-2026-${ticketData.id}.pkpass"`);
    res.send(passBuffer);

  } catch (error) {
    console.error('Error generating Apple Wallet pass:', error);
    res.status(500).json({
      error: 'Failed to generate Apple Wallet pass',
      details: error.message
    });
  }
});

// Google Wallet endpoint
app.post('/api/wallet/google', async (req, res) => {
  try {
    const { ticketData, qrCodeDataUrl } = req.body;

    if (!ticketData || !qrCodeDataUrl) {
      return res.status(400).json({
        error: 'Missing required fields: ticketData and qrCodeDataUrl'
      });
    }

    // Generate Google Wallet save URL
    const saveUrl = await generateGooglePass(ticketData, qrCodeDataUrl);

    res.json({
      success: true,
      saveUrl: saveUrl
    });

  } catch (error) {
    console.error('Error generating Google Wallet pass:', error);
    res.status(500).json({
      error: 'Failed to generate Google Wallet pass',
      details: error.message
    });
  }
});

// Export the Express app as a Firebase Function
exports.wallet = functions.https.onRequest(app);
