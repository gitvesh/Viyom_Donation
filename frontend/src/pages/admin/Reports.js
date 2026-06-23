import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { donationAPI } from '../../services/api';
import jsPDF from 'jspdf';

const Reports = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getAllDonations();
      setDonations(response || []);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError(err.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  // Generate single receipt PDF
  const generateReceiptPDF = (donation) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header with logo and title
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Viyom NGO', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Donation Receipt', pageWidth / 2, 30, { align: 'center' });
    
    // Success icon
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
    doc.roundedRect(20, boxY, pageWidth - 40, 100, 3, 3, 'FD');
    
    // Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let yPos = boxY + 15;
    
    // Donation ID
    doc.setTextColor(107, 114, 128);
    doc.text('Donation ID:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(String(donation.donationId || 'N/A'), pageWidth - 30, yPos, { align: 'right' });
    
    // Payment ID
    yPos += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Payment ID:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(donation.razorpayPaymentId || 'N/A', pageWidth - 30, yPos, { align: 'right' });
    
    // Order ID
    yPos += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Order ID:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(donation.razorpayOrderId || 'N/A', pageWidth - 30, yPos, { align: 'right' });
    
    // Donor Name
    yPos += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Donor Name:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(donation.donorName || 'Anonymous', pageWidth - 30, yPos, { align: 'right' });
    
    // Amount
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Amount:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`₹${donation.amount}`, pageWidth - 30, yPos, { align: 'right' });
    
    // Pool/Sector
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Pool:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(donation.poolName || 'General Donation', pageWidth - 30, yPos, { align: 'right' });
    
    // Payment Status
    yPos += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Payment Status:', 30, yPos);
    doc.setTextColor(22, 163, 74);
    doc.setFont('helvetica', 'bold');
    doc.text(donation.status === 'PAID' || donation.status === 'SUCCESS' ? 'PAID' : donation.status || 'PAID', pageWidth - 30, yPos, { align: 'right' });
    
    // Date
    yPos += 12;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('Date:', 30, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    const donationDate = donation.donatedAt ? new Date(donation.donatedAt) : new Date();
    doc.text(donationDate.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), pageWidth - 30, yPos, { align: 'right' });
    
    // Thank you message
    yPos += 20;
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(20, yPos, pageWidth - 40, 30, 3, 3, 'FD');
    
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Your payment has been successfully verified and recorded.', pageWidth / 2, yPos + 12, { align: 'center' });
    doc.text('Thank you for your generous contribution!', pageWidth / 2, yPos + 22, { align: 'center' });
    
    // Footer
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(9);
    doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('For any queries, please contact support@viyom.org', pageWidth / 2, pageHeight - 12, { align: 'center' });
    
    return doc;
  };

  // Download single receipt
  const downloadSingleReceipt = (donation) => {
    const doc = generateReceiptPDF(donation);
    doc.save(`Viyom_Receipt_${donation.donationId}_${donation.razorpayPaymentId}.pdf`);
  };

  // Download all receipts as separate PDFs in a zip (simplified: downloads one by one)
  const downloadAllReceipts = async () => {
    setDownloading(true);
    try {
      const filteredDonations = getFilteredDonations();
      
      if (filteredDonations.length === 0) {
        alert('No donations to download');
        return;
      }

      // Download each receipt with a small delay
      for (let i = 0; i < filteredDonations.length; i++) {
        const donation = filteredDonations[i];
        setTimeout(() => {
          downloadSingleReceipt(donation);
        }, i * 200); // 200ms delay between downloads
      }

      alert(`Downloading ${filteredDonations.length} receipt(s). Please check your downloads folder.`);
    } catch (err) {
      console.error('Error downloading receipts:', err);
      alert('Failed to download receipts');
    } finally {
      setDownloading(false);
    }
  };

  // Download summary report
  const downloadSummaryReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Viyom NGO', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Donations Summary Report', pageWidth / 2, 25, { align: 'center' });
    
    // Summary stats
    const filteredDonations = getFilteredDonations();
    const totalAmount = filteredDonations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    const totalDonations = filteredDonations.length;
    
    let yPos = 50;
    
    // Stats boxes
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(20, yPos, 80, 25, 3, 3, 'FD');
    doc.roundedRect(110, yPos, 80, 25, 3, 3, 'FD');
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.text('Total Donations', 60, yPos + 10, { align: 'center' });
    doc.text('Total Amount', 150, yPos + 10, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(totalDonations), 60, yPos + 20, { align: 'center' });
    doc.text(`₹${totalAmount.toFixed(2)}`, 150, yPos + 20, { align: 'center' });
    
    // Table header
    yPos = 90;
    doc.setFillColor(37, 99, 235);
    doc.rect(20, yPos, pageWidth - 40, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 25, yPos + 7);
    doc.text('Donor', 45, yPos + 7);
    doc.text('Amount', 100, yPos + 7);
    doc.text('Status', 135, yPos + 7);
    doc.text('Date', 165, yPos + 7);
    
    // Table rows
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    filteredDonations.slice(0, 20).forEach((donation, index) => {
      if (yPos > 270) return; // Page limit
      
      const bgColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
      doc.setFillColor(...bgColor);
      doc.rect(20, yPos, pageWidth - 40, 8, 'F');
      
      doc.text(String(donation.donationId || '-'), 25, yPos + 5);
      doc.text((donation.donorName || 'Anonymous').substring(0, 15), 45, yPos + 5);
      doc.text(`₹${donation.amount}`, 100, yPos + 5);
      doc.text(donation.status === 'PAID' || donation.status === 'SUCCESS' ? 'PAID' : donation.status || 'PAID', 135, yPos + 5);
      const date = donation.donatedAt ? new Date(donation.donatedAt).toLocaleDateString('en-IN') : '-';
      doc.text(date, 165, yPos + 5);
      
      yPos += 8;
    });
    
    if (filteredDonations.length > 20) {
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.text(`... and ${filteredDonations.length - 20} more donations`, pageWidth / 2, yPos + 10, { align: 'center' });
    }
    
    // Footer
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, 285, { align: 'center' });
    
    doc.save(`Viyom_Donations_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getFilteredDonations = () => {
    return donations.filter(donation => {
      const matchesSearch = 
        donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(donation.donationId).includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || 
        donation.status === filterStatus ||
        (filterStatus === 'PAID' && (donation.status === 'PAID' || donation.status === 'SUCCESS'));
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredDonations = getFilteredDonations();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Donation Reports
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              View and download donation receipts
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={downloadSummaryReport}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summary Report
            </button>
            
            <button
              onClick={downloadAllReceipts}
              disabled={downloading || filteredDonations.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download All ({filteredDonations.length})
                </>
              )}
            </button>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by donor name, payment ID, or donation ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <option value="all">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Donations</p>
              <p className="text-3xl font-bold mt-2">{filteredDonations.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <p className="text-3xl font-bold mt-2">
                ₹{filteredDonations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Donation</p>
              <p className="text-3xl font-bold mt-2">
                ₹{filteredDonations.length > 0 
                  ? (filteredDonations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0) / filteredDonations.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pool</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No donations found
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr key={donation.donationId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{donation.donationId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.donorName || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{donation.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {donation.poolName || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        donation.status === 'PAID' || donation.status === 'SUCCESS'
                          ? 'bg-green-100 text-green-800'
                          : donation.status === 'PENDING' || donation.status === 'CREATED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {donation.status === 'PAID' || donation.status === 'SUCCESS' ? 'PAID' : donation.status || 'PAID'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {donation.donatedAt 
                        ? new Date(donation.donatedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit'
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => downloadSingleReceipt(donation)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800">
          {error}
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Reports;
