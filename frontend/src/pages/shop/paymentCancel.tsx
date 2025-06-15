import axios from 'axios';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const PaymentCancel:React.FC = () => {
    useEffect(() => {
        const clearCart = async () => {
          try {
            const token = localStorage.getItem('access_token');
            await axios.post('/cart/clear/', {}, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              withCredentials: true,
            });
            toast.success('✅ Payment cancled successful!');
          } catch {
            toast.error('⚠️ Payment succeeded but failed to clear cart.');
          }
        };
    
        clearCart();
      }, []);
    
  return (
    <div className='cancled' style={{ padding: '2rem', textAlign: 'center' , margin: '14em auto'}}>
      <h1>Payment was cancled!</h1>
    </div>
  )
}

export default PaymentCancel
