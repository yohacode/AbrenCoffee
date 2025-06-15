import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const PaymentSuccess: React.FC = () => {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const clearCart = async () => {
      try {
        const token = localStorage.getItem('access_token');
        await axios.post('/cart/clear/', {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setCleared(true);
        toast.success('✅ Payment successful. Cart cleared!');
      } catch {
        toast.error('⚠️ Payment succeeded but failed to clear cart.');
      }
    };

    clearCart();
  }, []);

  return (
    <div>
      <h1>🎉 Thank You for Your Purchase!</h1>
      <p>Your payment has been successfully processed.</p>
      {cleared ? (
        <p>🛒 Your cart has been cleared.</p>
      ) : (
        <p>⏳ Finalizing your order...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
