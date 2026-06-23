import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const DonationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, paymentId, donationId, sector, orderId, verified, verificationError, blockchainTxnHash, message } = location.state || {};

  // Prevent direct access without proper payment data
  useEffect(() => {
    if (!paymentId || !amount) {
      console.warn('Unauthorized access to success page - redirecting');
      navigate('/donate', { replace: true });
    }
  }, [paymentId, amount, navigate]);

  // Function to generate and download PDF receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header with logo and title
    doc.setFillColor(37, 99, 235); // Blue background
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Organization name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Viyom NGO', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Donation Receipt', pageWidth / 2, 30, { align: 'center' });
    
    // Success icon (green checkmark)
    doc.setFillColor(34, 197, 94);
    doc.circle(pageWidth / 2, 60, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('✓', pageWidth / 2 - 3, 65);
    
    // Payment Successful text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Successful!', pageWidth / 2, 85, { align: 'center' });
    
    // Transaction details box
    const boxY = 100;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, boxY, pageWidth - 40, 90, 3, 3, 'FD');
    
    // Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let yPos = boxY + 15;
    
    // Payment ID
    doc.setTextColor(107, 114, 128);
    doc.text('Payment ID:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(paymentId || 'N/A', pageWidth - 30, yPos, { align: 'right' });
    
    // Order ID
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Order ID:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(orderId || 'N/A', pageWidth - 30, yPos, { align: 'right' });
    
    // Amount
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Amount:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`₹${amount}`, pageWidth - 30, yPos, { align: 'right' });
    
    // Sector
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Sector:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(sector || 'General Donation', pageWidth - 30, yPos, { align: 'right' });
    
    // Payment Status
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Payment Status:', 30, yPos);
    doc.setTextColor(22, 163, 74);
    doc.setFont('helvetica', 'bold');
    doc.text('Completed', pageWidth - 30, yPos, { align: 'right' });
    
    // Date
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Date:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), pageWidth - 30, yPos, { align: 'right' });
    
    // Thank you message
    yPos += 30;
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, 'FD');
    
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const thankYouText = 'Your payment has been successfully verified and recorded.';
    const thankYouText2 = 'Thank you for your generous contribution!';
    doc.text(thankYouText, pageWidth / 2, yPos + 12, { align: 'center' });
    doc.text(thankYouText2, pageWidth / 2, yPos + 22, { align: 'center' });
    
    // Footer
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('For any queries, please contact support@viyom.org', pageWidth / 2, pageHeight - 12, { align: 'center' });
    
    // Save the PDF
    doc.save(`Viyom_Donation_Receipt_${paymentId}.pdf`);
  };

  // Don't render if no payment data
  if (!paymentId || !amount) {
    return null;
  }

  // Debug logging
  console.log('DonationSuccess - location.state:', location.state);
  console.log('DonationSuccess - amount:', amount);
  console.log('DonationSuccess - paymentId:', paymentId);
  console.log('DonationSuccess - donationId:', donationId);
  console.log('DonationSuccess - orderId:', orderId);
  console.log('DonationSuccess - sector:', sector);
  console.log('DonationSuccess - verificationError:', verificationError);
  console.log('DonationSuccess - blockchainTxnHash:', blockchainTxnHash);
  console.log('DonationSuccess - message:', message);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] py-8 px-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-12 rounded-xl shadow-md text-center">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-5xl font-bold mx-auto mb-6">✓</div>
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Payment Successful!</h1>
          <div className="text-left mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Payment ID:</span>
              <span className="font-semibold text-gray-900 text-sm">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Order ID:</span>
              <span className="font-semibold text-gray-900 text-sm">{orderId || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">₹{amount}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Sector:</span>
              <span className="font-semibold text-gray-900">{sector || 'General Donation'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-medium text-gray-600">Payment Status:</span>
              <span className="font-semibold text-green-600">Completed</span>
            </div>
            {blockchainTxnHash && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="font-medium text-gray-600">Blockchain Tx:</span>
                <div className="text-right">
                  <span className="font-semibold text-blue-600 text-xs break-all">
                    {blockchainTxnHash}
                  </span>
                  <br />
                  <a 
                    href={`https://amoy.polygonscan.com/tx/${blockchainTxnHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-xs underline"
                  >
                    View on PolygonScan
                  </a>
                </div>
              </div>
            )}
            {message && (
              <div className="flex justify-between items-center py-3">
                <span className="font-medium text-gray-600">Blockchain Status:</span>
                <span className="font-semibold text-blue-600 text-sm">{message}</span>
              </div>
            )}
          </div>
          
          {verificationError ? (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Note:</strong> Your payment was successful, but there was a delay in verification. 
                Your donation has been recorded and will be processed shortly.
              </p>
              <p className="text-xs text-yellow-700">
                If you have any concerns, please contact support with your Payment ID: {paymentId}
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Your payment has been successfully verified and recorded. 
                Thank you for your generous contribution!
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={downloadReceipt}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </button>
            <Link to="/dashboard" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
              Go to Dashboard
            </Link>
            <Link to="/donate" className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center">
              Donate Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccess;
