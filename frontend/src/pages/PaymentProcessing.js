import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/donation-success');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-white">
      <div className="text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-2xl text-gray-700 font-medium">Completing secure payment...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
