import QRCode from 'qrcode';

// Event configuration
export const EVENT_CONFIG = {
  name: 'The Ultimate Sacrifice On Golgotha',
  date: 'April 4, 2026',
  time: '6:00 PM',
  location: 'Sharon Event Center, 940 Barnes Bridge Rd, Mesquite, TX 75150',
  organizerEmail: 'stpmtcdallas@outlook.com'
};

/**
 * Generate SHA-256 checksum for ticket validation
 */
export async function generateChecksum(data) {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Format registration data for QR code
 */
export async function formatTicketData(registrationId, formData) {
  const ticketData = {
    id: registrationId,
    name: formData.name,
    email: formData.email,
    ticketType: formData.ticketType,
    tickets: parseInt(formData.tickets) || 1,
    totalAmount: parseFloat(formData.totalAmount) || 0,
    eventDate: '2026-04-04',
    registeredAt: new Date().toISOString()
  };

  // Generate checksum for validation
  const checksum = await generateChecksum(ticketData);

  return {
    ...ticketData,
    checksum
  };
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(ticketData) {
  const qrDataString = JSON.stringify(ticketData);

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrDataString, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // High error correction for better scanning
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Get ticket type display name
 */
export function getTicketTypeDisplay(ticketType) {
  const typeMap = {
    'general-admission': 'General Admission',
    'vip': 'VIP',
    'student': 'Student',
    'early-bird': 'Early Bird'
  };
  return typeMap[ticketType] || ticketType;
}
