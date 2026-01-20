# Google Wallet Certificates

To enable Google Wallet functionality, you need to set up Google Cloud service account credentials.

## Required Files

Place the following file in this directory:

1. `service-account-key.json` - Google Cloud service account credentials

## How to Obtain This File

### Step 1: Create a Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create a new project or select an existing one
3. Enable billing for the project

### Step 2: Enable Google Wallet API
1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Wallet API"
3. Click "Enable"

### Step 3: Register as a Google Pay and Wallet Issuer
1. Go to https://pay.google.com/business/console
2. Sign in with your Google account
3. Accept the terms of service
4. Note your Issuer ID (you'll need this)

### Step 4: Create a Service Account
1. In Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `wallet-service-account`
4. Grant the role: "Wallet Object Creator"
5. Click "Create and Continue"
6. Click "Done"

### Step 5: Create and Download Key
1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Click "Create"
6. The file will download automatically - save it as `service-account-key.json`
7. Move this file to this directory

### Step 6: Configure Your Environment
Add these environment variables to your `.env` file:

```env
GOOGLE_WALLET_ISSUER_ID=your_issuer_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=wallet-service-account@your-project-id.iam.gserviceaccount.com
```

You can also store the entire service account key as an environment variable:
```env
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"..."}'
```

## Creating the Event Ticket Class

Before you can create passes, you need to create the event ticket class (one-time setup):

```javascript
// Run this once to create the class
const { createEventTicketClass } = require('./wallet/googleWallet');
await createEventTicketClass();
```

## Security Notes

- **NEVER** commit the `service-account-key.json` file to version control
- Add `functions/certificates/` to your `.gitignore`
- Store credentials securely using environment variables or secret managers
- Use Firebase Functions config for secure storage:
  ```bash
  firebase functions:config:set google.service_account="$(cat service-account-key.json)"
  ```

## Testing

You can test the Google Wallet integration using the Google Wallet API test environment:
- Test cards won't appear in production Google Wallet
- Use the API Explorer: https://developers.google.com/wallet/tickets/events/rest
