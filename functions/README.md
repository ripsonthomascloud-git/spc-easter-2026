# Firebase Functions - Wallet Integration

This directory contains Firebase Cloud Functions for Apple Wallet and Google Wallet integration.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values.

### 3. Set Up Certificates

Follow the detailed instructions in:
- `certificates/apple/README.md` for Apple Wallet
- `certificates/google/README.md` for Google Wallet

### 4. Test Locally

```bash
npm run serve
```

The functions will be available at:
- `http://localhost:5001/YOUR-PROJECT-ID/us-central1/wallet`

### 5. Deploy to Firebase

```bash
npm run deploy
```

## API Endpoints

### POST /api/wallet/apple

Generates an Apple Wallet pass (.pkpass file)

**Request Body:**
```json
{
  "ticketData": {
    "id": "TICKET123",
    "name": "John Doe",
    "email": "john@example.com",
    "ticketType": "standard",
    "tickets": 2,
    "totalAmount": "$40.00"
  },
  "qrCodeDataUrl": "data:image/png;base64,..."
}
```

**Response:**
- Binary .pkpass file for download

### POST /api/wallet/google

Generates a Google Wallet save URL

**Request Body:**
```json
{
  "ticketData": {
    "id": "TICKET123",
    "name": "John Doe",
    "email": "john@example.com",
    "ticketType": "standard",
    "tickets": 2,
    "totalAmount": "$40.00"
  },
  "qrCodeDataUrl": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "saveUrl": "https://pay.google.com/gp/v/save/..."
}
```

## Project Structure

```
functions/
├── certificates/          # Certificate storage (git-ignored)
│   ├── apple/            # Apple Wallet certificates
│   └── google/           # Google service account key
├── wallet/               # Wallet implementation
│   ├── appleWallet.js    # Apple Wallet pass generation
│   └── googleWallet.js   # Google Wallet pass generation
├── index.js              # Main function entry point
├── package.json          # Dependencies
└── .env                  # Environment variables (git-ignored)
```

## Development Tips

### Testing Without Certificates

For quick testing without setting up certificates, you can modify the code to return mock data:

```javascript
// In index.js, temporarily replace the function calls:

// Apple Wallet endpoint
app.post('/api/wallet/apple', async (req, res) => {
  res.json({ message: 'Mock Apple Wallet pass', data: req.body.ticketData });
});

// Google Wallet endpoint
app.post('/api/wallet/google', async (req, res) => {
  res.json({ success: true, saveUrl: 'https://example.com/mock' });
});
```

### Viewing Logs

```bash
# View function logs
npm run logs

# Or use Firebase console
firebase functions:log --only wallet
```

### Common Issues

1. **Module not found errors**: Run `npm install`
2. **Certificate errors**: Check paths in `wallet/appleWallet.js` and `wallet/googleWallet.js`
3. **CORS errors**: Update allowed origins in `index.js`
4. **Timeout errors**: Increase function timeout in Firebase console

## Next Steps

1. ✅ Set up certificates (see certificate README files)
2. ✅ Configure environment variables
3. ✅ Test locally with emulator
4. ✅ Deploy to Firebase
5. ✅ Update frontend `.env` with deployed URL
6. ✅ Test on real iOS/Android devices

## Resources

- [Full Setup Guide](../WALLET_SETUP.md)
- [Apple Wallet Documentation](https://developer.apple.com/wallet/)
- [Google Wallet Documentation](https://developers.google.com/wallet)
