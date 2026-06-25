import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { donationAPI } from '../services/api';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const donationData = location.state || JSON.parse(localStorage.getItem('donationData') || '{}');
  const { amount, poolId, poolName, sectorId } = donationData;

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setError('You are offline. Please check your internet connection and try again.');
      setLoading(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove any lingering Razorpay modals
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Force remove any Razorpay overlays
      const razorpayContainer = document.querySelector('.razorpay-container');
      if (razorpayContainer) {
        razorpayContainer.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Check network connectivity first
    if (!navigator.onLine) {
      setError('You are offline. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    // Check if user is logged in
    const user = localStorage.getItem('viyom_user');
    if (!user) {
      // Store donation data and redirect to login
      localStorage.setItem('donationData', JSON.stringify(donationData));
      navigate('/login', { state: { from: '/payment-processing', message: 'Please log in to complete your donation' } });
      return;
    }

    if (!amount || !poolId) {
      setError('Missing donation information. Please try again.');
      setLoading(false);
      return;
    }

    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => {
          setError('Failed to load payment gateway. Please try again.');
          setLoading(false);
        };
        document.body.appendChild(script);
      });
    };

    const initiatePayment = async () => {
      try {
        // Double-check network connectivity before API call
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network and try again.');
        }

        setLoading(true);
        const orderData = await donationAPI.createOrder({
          amount: parseFloat(amount),
          poolId: poolId,
          sectorId: sectorId || 1,
        });

        // Check connectivity again before loading Razorpay
        if (!navigator.onLine) {
          throw new Error('Connection lost. Please check your internet and try again.');
        }

        const Razorpay = await loadRazorpay();
        if (!Razorpay) throw new Error('Razorpay not loaded');

        // Debug: Check environment variable
        console.log('Environment check - Razorpay Key:', process.env.REACT_APP_RAZORPAY_KEY);
        console.log('Using key:', process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_SNXBJWvVtz8wkt');

        let rzpInstance = null;

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_SNXBJWvVtz8wkt',
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Viyom NGO',
          description: `Donation to ${poolName || 'Charity Pool'}`,
          order_id: orderData.razorpayOrderId,
          handler: async function (response) {
            try {
              console.log('Payment successful, verifying...', response);
              
              // Close the Razorpay modal immediately and forcefully
              if (rzpInstance) {
                try {
                  rzpInstance.close();
                } catch (e) {
                  console.log('Error closing modal:', e);
                }
              }

              // Also try to close any Razorpay iframes/overlays manually
              const razorpayOverlay = document.querySelector('.razorpay-container');
              if (razorpayOverlay) {
                razorpayOverlay.style.display = 'none';
              }

              // Check network before verification
              if (!navigator.onLine) {
                setError('Connection lost during payment. Please contact support with your payment ID: ' + response.razorpay_payment_id);
                setLoading(false);
                return;
              }

              setLoading(true);
              
              const verifyResponse = await donationAPI.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                donorPhone: donationData.phone // ✅ Pass phone from form
              });
              
              console.log('Verification response:', verifyResponse);
              
              // Clear donation data
              localStorage.removeItem('donationData');
              
              // Navigate immediately without delay
              navigate('/donation-success', {
                state: { 
                  amount, 
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  donationId: verifyResponse?.donationId || verifyResponse?.id,
                  sector: poolName || 'General Donation',
                  verified: true,
                  blockchainTxnHash: verifyResponse?.blockchainTxnHash,
                  message: verifyResponse?.message
                },
                replace: true
              });
            } catch (err) {
              console.error('Payment verification error:', err);
              
              // Close modal forcefully
              if (rzpInstance) {
                try {
                  rzpInstance.close();
                } catch (e) {
                  console.log('Error closing modal:', e);
                }
              }

              // Remove Razorpay overlay
              const razorpayOverlay = document.querySelector('.razorpay-container');
              if (razorpayOverlay) {
                razorpayOverlay.style.display = 'none';
              }

              // Even if verification API fails, the payment was successful
              // Navigate to success page with a note
              localStorage.removeItem('donationData');
              
              navigate('/donation-success', {
                state: { 
                  amount, 
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  sector: poolName || 'General Donation',
                  verified: false,
                  verificationError: true
                },
                replace: true
              });
            }
          },
          prefill: {
            name: donationData.fullName || '',
            email: donationData.email || '',
            contact: donationData.phone || '',
          },
          notes: { pool_id: poolId, pool_name: poolName || '' },
          theme: { color: '#2563eb' },
          modal: {
            ondismiss: function() {
              setError('Payment cancelled. You can try again.');
              setLoading(false);
            },
            onhidden: function() {
              // Check if payment was not completed
              if (!navigator.onLine) {
                setError('Connection lost. Payment was not processed.');
              }
            }
          },
        };

        rzpInstance = new Razorpay(options);
        rzpInstance.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          console.error('Full payment failure response:', response);
          setError(`Payment failed: ${response.error.description || response.error.code || 'Please try again'}`);
          setLoading(false);
        });
        rzpInstance.open();
        setLoading(false);
      } catch (err) {
        console.error('Payment initiation error:', err);
        if (err.message.includes('Network') || err.message.includes('Failed to fetch') || !navigator.onLine) {
          setError('No internet connection. Payment was not initiated. No amount has been deducted.');
        } else {
          setError(err.message || 'Failed to initiate payment. Please try again.');
        }
        setLoading(false);
      }
    };

    initiatePayment();
  }, [amount, poolId, poolName, sectorId, donationData, navigate]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-white">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">{isOnline ? '❌' : '📡'}</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {isOnline ? 'Payment Error' : 'No Internet Connection'}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {!isOnline && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> No payment has been processed. Your money is safe. 
                Please check your internet connection and try again.
              </p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            {isOnline ? (
              <>
                <button onClick={() => navigate('/donate')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Try Again</button>
                <button onClick={() => navigate('/')} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Go Home</button>
              </>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Retry Connection
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-white">
      <div className="text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-2xl text-gray-700 font-medium">Initializing secure payment...</p>
          <p className="text-gray-500">Please wait while we connect to Razorpay</p>
          {amount && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Amount to pay</p>
              <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;