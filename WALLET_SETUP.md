# Wallet Integration Setup Guide

This guide will help you set up Apple Wallet and Google Wallet integration for your SPC Easter 2026 event tickets.

## Overview

The wallet integration allows users to add their event tickets to:
- **Apple Wallet** (iOS devices)
- **Google Wallet** (Android devices)

## Prerequisites

- Node.js 18 or higher
- Firebase CLI installed (`npm install -g firebase-tools`)
- Active Firebase project
- Apple Developer Account ($99/year) for Apple Wallet
- Google Cloud Platform account for Google Wallet

## Quick Start

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Update Environment Variables

Create or update `functions/.env`:

```env
# Apple Wallet
APPLE_PASS_PASSPHRASE=your_certificate_passphrase

# Google Wallet
GOOGLE_WALLET_ISSUER_ID=your_issuer_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com

# Optional: Store Google credentials as environment variable
# GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 3. Set Up Certificates

#### Apple Wallet Certificates
Follow the instructions in `functions/certificates/apple/README.md` to:
1. Create a Pass Type ID in Apple Developer Portal
2. Generate and download certificates
3. Convert certificates to PEM format
4. Place them in `functions/certificates/apple/`

Required files:
- `wwdr.pem`
- `signerCert.pem`
- `signerKey.pem`

#### Google Wallet Credentials
Follow the instructions in `functions/certificates/google/README.md` to:
1. Create a Google Cloud project
2. Enable Google Wallet API
3. Create a service account
4. Download the service account key
5. Place it in `functions/certificates/google/service-account-key.json`

### 4. Update Frontend Configuration

Add the API URL to your frontend `.env`:

```env
# For local development
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/wallet

# For production
VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/wallet
```

### 5. Deploy Functions

```bash
# Test locally first
cd functions
npm run serve

# Deploy to Firebase
firebase deploy --only functions
```

## Testing Locally

### Start the Firebase Emulator

```bash
cd functions
npm run serve
```

This will start the functions emulator at `http://localhost:5001`

### Test Endpoints

#### Test Apple Wallet Endpoint
```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/wallet/api/wallet/apple \
  -H "Content-Type: application/json" \
  -d '{
    "ticketData": {
      "id": "TEST123",
      "name": "John Doe",
      "email": "john@example.com",
      "ticketType": "standard",
      "tickets": 2,
      "totalAmount": "$40.00"
    },
    "qrCodeDataUrl": "data:image/png;base64,..."
  }' \
  --output test-ticket.pkpass
```

#### Test Google Wallet Endpoint
```bash
curl -X POST http://localhost:5001/your-project-id/us-central1/wallet/api/wallet/google \
  -H "Content-Type: application/json" \
  -d '{
    "ticketData": {
      "id": "TEST123",
      "name": "John Doe",
      "email": "john@example.com",
      "ticketType": "standard",
      "tickets": 2,
      "totalAmount": "$40.00"
    },
    "qrCodeDataUrl": "data:image/png;base64,..."
  }'
```

## Development Without Certificates (Testing Only)

If you want to test the integration without setting up certificates:

### Option 1: Use Mock Data

Modify `functions/index.js` to use simplified versions:

```javascript
const { generateSimpleApplePass } = require('./wallet/appleWallet');
const { generateSimpleGooglePass } = require('./wallet/googleWallet');

// In the Apple endpoint
const passBuffer = await generateSimpleApplePass(ticketData, qrCodeDataUrl);

// In the Google endpoint
const saveUrl = await generateSimpleGooglePass(ticketData, qrCodeDataUrl);
```

### Option 2: Return Test Responses

For frontend testing, you can return mock responses:

```javascript
// Apple Wallet endpoint
res.json({ message: 'Apple Wallet pass would be generated here', ticketData });

// Google Wallet endpoint
res.json({ success: true, saveUrl: 'https://example.com/test' });
```

## Production Deployment

### 1. Security Checklist

- [ ] Certificates are NOT committed to git
- [ ] Environment variables are set in Firebase Functions config
- [ ] CORS is properly configured for your domain
- [ ] API endpoints are rate-limited (optional but recommended)

### 2. Set Firebase Environment Variables

```bash
# Set Apple passphrase
firebase functions:config:set apple.passphrase="your_passphrase"

# Set Google credentials
firebase functions:config:set google.issuer_id="your_issuer_id"
firebase functions:config:set google.service_account="$(cat functions/certificates/google/service-account-key.json)"
```

### 3. Deploy

```bash
firebase deploy --only functions
```

### 4. Update Frontend .env

Update your production `.env` with the deployed function URL:

```env
VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/wallet
```

### 5. Test on Real Devices

- **iOS**: Use an iPhone with iOS 15+ and test adding to Apple Wallet
- **Android**: Use an Android phone with Google Wallet app installed

## Troubleshooting

### Apple Wallet Issues

**Problem**: "Unable to add pass" error
- Ensure certificates are properly formatted and not expired
- Check that Pass Type ID matches in both certificate and code
- Verify the pass JSON structure is valid

**Problem**: Pass appears but with errors
- Check that all required fields are present
- Verify image assets are included (if using custom pass template)

### Google Wallet Issues

**Problem**: "Invalid JWT" error
- Ensure service account has correct permissions
- Check that the JWT signing key matches the service account
- Verify the issuer ID is correct

**Problem**: "Class not found" error
- Run `createEventTicketClass()` to create the class first
- Ensure the class ID matches in both creation and usage

### General Issues

**Problem**: CORS errors
- Update CORS configuration in `functions/index.js`
- Add your domain to allowed origins

**Problem**: Function timeout
- Increase timeout in Firebase Functions configuration
- Optimize certificate loading (cache in memory)

## Cost Considerations

### Apple Wallet
- Apple Developer Program: $99/year
- Firebase Functions: Pay per invocation (free tier: 2M invocations/month)

### Google Wallet
- Google Cloud: Pay per API call (free tier available)
- Google Wallet API: Free for up to 100,000 passes/month

## Additional Resources

- [Apple Wallet Developer Guide](https://developer.apple.com/wallet/)
- [Google Wallet Developer Guide](https://developers.google.com/wallet)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Passkit Generator NPM Package](https://www.npmjs.com/package/passkit-generator)

## Support

For issues specific to this implementation, check:
1. Firebase Functions logs: `firebase functions:log`
2. Frontend browser console
3. Network tab in browser DevTools

## Next Steps

After successful setup:
1. Create custom pass designs (Apple Wallet templates)
2. Add push notification updates for passes
3. Implement pass versioning for ticket updates
4. Add analytics to track wallet adoption rate
