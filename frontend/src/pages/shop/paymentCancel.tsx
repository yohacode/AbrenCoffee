import axios from 'axios';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import './paymentCancel.css'; // Import external CSS

const PaymentCancel:React.FC = () => {
    useEffect(() => {
        const clearCart = async () => {
          try {
            const token = localStorage.getItem('access_token');
            await axios.post('/cart/clear/', {}, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              withCredentials: true,
            });
            toast.success('✅ Payment canceled successfully!');
          } catch {
            toast.error('⚠️ Payment succeeded but failed to clear cart.');
          }
        };
    
        clearCart();
      }, []);
    
  return (
    <div className='canceled'>
      <h1>Payment was <span>canceled!</span></h1>
      <button onClick={() => window.location.href = '/'}>Back to home</button>
    </div>
  )
}

export default PaymentCancel
