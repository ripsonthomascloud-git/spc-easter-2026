# Apple Wallet Certificates

To enable Apple Wallet functionality, you need to obtain certificates from the Apple Developer Portal.

## Required Files

Place the following files in this directory:

1. `wwdr.pem` - Apple's WWDR (Worldwide Developer Relations) certificate
2. `signerCert.pem` - Your Pass Type ID certificate
3. `signerKey.pem` - Your Pass Type ID private key

## How to Obtain These Files

### Step 1: Join Apple Developer Program
- You need an active Apple Developer account ($99/year)
- Visit: https://developer.apple.com/programs/

### Step 2: Create a Pass Type ID
1. Go to https://developer.apple.com/account/resources/identifiers/list/passTypeId
2. Click the "+" button to create a new Pass Type ID
3. Use identifier: `pass.com.spc.easter2026` (or your preferred identifier)
4. Register the Pass Type ID

### Step 3: Create Certificate
1. In the Pass Type IDs section, select your Pass Type ID
2. Click "Create Certificate"
3. Follow the instructions to create a Certificate Signing Request (CSR)
4. Upload the CSR
5. Download the certificate (this becomes your `signerCert.pem`)

### Step 4: Convert Certificate to PEM
```bash
# Convert the downloaded certificate to PEM format
openssl x509 -inform der -in pass.cer -out signerCert.pem

# Export the private key from your keychain
# Open Keychain Access, find your certificate, export as .p12
# Then convert to PEM:
openssl pkcs12 -in Certificates.p12 -out signerKey.pem -nodes -clcerts
```

### Step 5: Download WWDR Certificate
1. Download from: https://www.apple.com/certificateauthority/
2. Get the "WWDR - G4" certificate
3. Convert to PEM:
```bash
openssl x509 -inform der -in AppleWWDRCAG4.cer -out wwdr.pem
```

## Security Notes

- **NEVER** commit these certificate files to version control
- Add `functions/certificates/` to your `.gitignore`
- Store certificates securely (use environment variables or secret managers in production)
- Rotate certificates before they expire

## Testing Without Certificates

For development/testing, you can use the simplified version in the code that returns JSON instead of a valid .pkpass file. However, this won't work in actual Apple Wallet.
