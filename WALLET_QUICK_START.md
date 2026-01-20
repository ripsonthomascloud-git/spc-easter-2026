# Wallet Integration - Quick Start Guide

This is a simplified guide to get your Apple Wallet and Google Wallet endpoints up and running.

## 🚀 Fastest Path (Without Certificates - For Testing)

If you want to test the frontend integration without setting up certificates:

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Create Mock Endpoints
Edit `functions/index.js` and replace the wallet endpoints with mock versions:

```javascript
// Apple Wallet endpoint (MOCK VERSION)
app.post('/api/wallet/apple', async (req, res) => {
  const { ticketData } = req.body;

  // Return success for testing
  res.json({
    success: true,
    message: 'Apple Wallet pass would be generated here',
    ticketId: ticketData.id
  });
});

// Google Wallet endpoint (MOCK VERSION)
app.post('/api/wallet/google', async (req, res) => {
  const { ticketData } = req.body;

  // Return success with mock URL
  res.json({
    success: true,
    saveUrl: `https://example.com/wallet/google/${ticketData.id}`,
    message: 'Google Wallet pass would be generated here'
  });
});
```

### 3. Start Local Server
```bash
npm run serve
```

### 4. Update Frontend .env
Add to your `.env` file:
```env
VITE_API_URL=http://localhost:5001/YOUR-PROJECT-ID/us-central1/wallet
```
Replace `YOUR-PROJECT-ID` with your actual Firebase project ID.

### 5. Test
- Run your frontend app
- Generate a ticket
- Click "Add to Wallet" - it will call your mock endpoint

---

## 📱 Production Setup (With Real Wallet Integration)

For actual wallet functionality, follow these steps:

### Apple Wallet Setup

1. **Join Apple Developer Program** ($99/year)
   - https://developer.apple.com/programs/

2. **Create Pass Type ID**
   - Go to: https://developer.apple.com/account/resources/identifiers
   - Create new Pass Type ID: `pass.com.spc.easter2026`

3. **Generate Certificates**
   ```bash
   # Generate CSR
   openssl req -new -newkey rsa:2048 -nodes -keyout signerKey.pem -out request.csr

   # Upload CSR to Apple Developer Portal
   # Download certificate and convert
   openssl x509 -inform der -in pass.cer -out signerCert.pem
   ```

4. **Download WWDR Certificate**
   - Get from: https://www.apple.com/certificateauthority/
   - Convert: `openssl x509 -inform der -in AppleWWDRCAG4.cer -out wwdr.pem`

5. **Place Files**
   ```
   functions/certificates/apple/
   ├── wwdr.pem
   ├── signerCert.pem
   └── signerKey.pem
   ```

### Google Wallet Setup

1. **Create Google Cloud Project**
   - https://console.cloud.google.com/

2. **Enable Google Wallet API**
   - Search "Google Wallet API" in API Library
   - Click Enable

3. **Register as Issuer**
   - https://pay.google.com/business/console
   - Get your Issuer ID

4. **Create Service Account**
   - IAM & Admin > Service Accounts
   - Create service account with "Wallet Object Creator" role
   - Create JSON key
   - Save as `functions/certificates/google/service-account-key.json`

5. **Configure Environment**
   ```bash
   # functions/.env
   GOOGLE_WALLET_ISSUER_ID=your_issuer_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=wallet-service@project.iam.gserviceaccount.com
   ```

### Deploy

```bash
# Test locally first
cd functions
npm run serve

# Deploy to Firebase
npm run deploy

# Update frontend .env
# VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/wallet
```

---

## 🔧 Troubleshooting

### "Module not found" errors
```bash
cd functions
npm install
```

### CORS errors
Update `functions/index.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com']
}));
```

### Certificate errors (Apple)
- Verify all 3 .pem files are in `functions/certificates/apple/`
- Check file permissions: `chmod 600 *.pem`
- Ensure certificate hasn't expired

### Google Wallet "Invalid JWT"
- Verify Issuer ID matches in code and Google console
- Check service account key is valid JSON
- Ensure service account has correct permissions

---

## 📚 Full Documentation

For complete setup instructions, see:
- [WALLET_SETUP.md](./WALLET_SETUP.md) - Comprehensive setup guide
- [functions/README.md](./functions/README.md) - Functions documentation
- [functions/certificates/apple/README.md](./functions/certificates/apple/README.md) - Apple Wallet details
- [functions/certificates/google/README.md](./functions/certificates/google/README.md) - Google Wallet details

---

## ✅ Checklist

### For Mock Testing
- [ ] Install functions dependencies
- [ ] Add mock endpoints to functions/index.js
- [ ] Start Firebase emulator
- [ ] Update frontend VITE_API_URL
- [ ] Test wallet buttons in frontend

### For Production
- [ ] Apple Developer account active
- [ ] Pass Type ID created
- [ ] Apple certificates generated and placed
- [ ] Google Cloud project created
- [ ] Google Wallet API enabled
- [ ] Service account created with key
- [ ] Environment variables configured
- [ ] Functions deployed to Firebase
- [ ] Frontend VITE_API_URL updated with production URL
- [ ] Tested on real iOS/Android devices

---

## 💡 Tips

1. **Start with mock endpoints** to test the frontend integration first
2. **Set up one wallet at a time** (Apple OR Google first, not both)
3. **Test locally** before deploying to Firebase
4. **Use Firebase emulator** for development (free)
5. **Check logs** if something fails: `firebase functions:log`

## Need Help?

- Check [WALLET_SETUP.md](./WALLET_SETUP.md) for detailed troubleshooting
- Review Firebase Functions logs for errors
- Check browser console for frontend errors
