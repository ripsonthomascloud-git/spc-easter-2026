# Apple Wallet Pass Models

This directory contains the template for Apple Wallet passes.

## Structure

Each pass template is a directory with the `.pass` extension containing:

1. **pass.json** - The main pass structure and styling
2. **logo.png** - Logo image (160x50 pixels @1x, 320x100 @2x)
3. **icon.png** - Icon image (29x29 pixels @1x, 58x58 @2x)
4. **thumbnail.png** (optional) - Thumbnail image

## SPC_Easter_2026.pass

This is the event ticket template for SPC Easter 2026.

### Required Customizations

1. **Team ID**: Replace `YOUR_TEAM_ID` in `pass.json` with your Apple Developer Team ID
2. **Pass Type ID**: Should match your registered Pass Type ID (currently: `pass.com.spc.easter2026`)

### Adding Images

Create and add these images to the `SPC_Easter_2026.pass` directory:

#### logo.png / logo@2x.png
- Standard: 160x50 pixels
- Retina: 320x100 pixels
- Your event logo

#### icon.png / icon@2x.png
- Standard: 29x29 pixels
- Retina: 58x58 pixels
- Small icon for notifications

#### thumbnail.png / thumbnail@2x.png (optional)
- Standard: 90x90 pixels
- Retina: 180x180 pixels
- Event thumbnail

### Creating Images

You can use any image editor. Here's a quick guide using ImageMagick:

```bash
# Create a simple logo (replace with your actual design)
convert -size 320x100 -background "#8B4513" -fill white -gravity center \
  -pointsize 40 -font Arial label:"SPC Easter 2026" logo@2x.png

convert logo@2x.png -resize 50% logo.png

# Create a simple icon
convert -size 58x58 -background "#8B4513" -fill "#FFD700" -gravity center \
  -pointsize 30 label:"SPC" icon@2x.png

convert icon@2x.png -resize 50% icon.png
```

### Pass Structure

The `pass.json` file defines:
- **formatVersion**: Always 1
- **passTypeIdentifier**: Your registered Pass Type ID
- **teamIdentifier**: Your Apple Team ID
- **organizationName**: Displayed as issuer
- **foregroundColor**: Text color (RGB)
- **backgroundColor**: Background color (RGB)
- **labelColor**: Label text color (RGB)

### Field Types

#### eventTicket Object
- **primaryFields**: Large, prominent field (e.g., attendee name)
- **secondaryFields**: Medium-sized fields (e.g., ticket type, quantity)
- **auxiliaryFields**: Smaller fields (e.g., email)
- **backFields**: Information on the back of the pass

Each field has:
- **key**: Unique identifier
- **label**: Field label (uppercase recommended)
- **value**: Field value (set dynamically by the function)

### Barcode

The pass includes a QR code with the ticket ID for scanning at entry.

Supported formats:
- PKBarcodeFormatQR
- PKBarcodeFormatPDF417
- PKBarcodeFormatAztec
- PKBarcodeFormatCode128

## Testing Your Pass

### Method 1: Using Passkit Generator (Programmatic)
The functions use the `passkit-generator` npm package which automatically handles:
- Image inclusion
- Manifest generation
- Signing with certificates
- ZIP file creation

### Method 2: Manual Creation (Testing)
For testing the design without certificates:

1. Create all required files in the `.pass` directory
2. Generate manifest:
```bash
cd SPC_Easter_2026.pass
find . -type f | while read file; do
  echo "\"${file#./}\": \"$(shasum -a 256 "$file" | cut -d' ' -f1)\""
done > manifest.json
```

3. Sign and package (requires certificates):
```bash
openssl smime -binary -sign -certfile wwdr.pem -signer signerCert.pem \
  -inkey signerKey.pem -in manifest.json -out signature \
  -outform DER -passin pass:YOUR_PASSPHRASE

zip -r SPC_Easter_2026.pkpass .
```

## Resources

- [Apple Wallet Pass Design](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html)
- [Pass Design and Creation Guide](https://developer.apple.com/design/human-interface-guidelines/wallet)
- [Passkit Generator Docs](https://github.com/alexandercerutti/passkit-generator)
