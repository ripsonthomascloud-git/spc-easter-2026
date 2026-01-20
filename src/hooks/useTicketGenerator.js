import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { formatTicketData, generateQRCode } from '../utils/ticketGenerator';

export function useTicketGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ticketBlob, setTicketBlob] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);

  const generateTicket = useCallback(async (registrationId, formData) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Format ticket data and generate QR code
      const formattedData = await formatTicketData(registrationId, formData);
      const qrCode = await generateQRCode(formattedData);

      setTicketData(formattedData);
      setQrCodeDataUrl(qrCode);

      // Return the data for immediate use (the blob will be generated when downloading)
      return { ticketData: formattedData, qrCodeDataUrl: qrCode };
    } catch (err) {
      console.error('Error generating ticket:', err);
      setError(err.message || 'Failed to generate ticket');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const downloadTicket = useCallback(async (ticketElement) => {
    if (!ticketElement) {
      setError('Ticket element not found');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Use html2canvas to render the ticket element
      const canvas = await html2canvas(ticketElement, {
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: 1200
      });

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });

      setTicketBlob(blob);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `spc-easter-2026-ticket-${ticketData?.id || Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Error downloading ticket:', err);
      setError(err.message || 'Failed to download ticket');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [ticketData]);

  const reset = useCallback(() => {
    setTicketBlob(null);
    setQrCodeDataUrl(null);
    setTicketData(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  return {
    generateTicket,
    downloadTicket,
    reset,
    isGenerating,
    ticketBlob,
    qrCodeDataUrl,
    ticketData,
    error
  };
}
