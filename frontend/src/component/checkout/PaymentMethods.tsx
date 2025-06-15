import React from 'react';
import { FaCcStripe, FaPaypal } from 'react-icons/fa';
import { SiWish} from 'react-icons/si';
import './PaymentMethods.css';
import axios from '../../utils/axios';

interface Cart {
  total_price: number;
}

interface Props {
  cart: Cart;
  email: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  phoneNumber: string; 
  orderId?: number | null;
}

const PaymentMethods: React.FC<Props> = ({ cart, email, loading, setLoading, phoneNumber,orderId, }) => {
  const paymentOptions = [
    { id: 'stripe', label: 'Stripe', icon: <FaCcStripe /> },
    { id: 'paypal', label: 'PayPal', icon: <FaPaypal /> },
    { id: 'swish', label: 'Swish', icon: <SiWish/> },
  ];

  const handleStripePayment = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        '/payment/stripe/',
        { email, amount: cart.total_price },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
  
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        console.error('Missing Stripe redirect URL.');
      }
    } catch (err) {
      console.error(err);
      alert('Stripe payment failed.');
    }
  };

  const handleSwishPayment = async () => {
    if (!cart?.total_price || !phoneNumber) {
      alert("Please enter your phone number and ensure the cart is loaded.");
      return;
    }
  
    try {
      const token = localStorage.getItem("access_token");
  
      const response = await axios.post<SetupPaymentResponse>(
        "/payment/swish/setup/",
        {
          amount: cart.total_price,
          phone_number: phoneNumber, // ✅ use the passed-in prop
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
  
      const approvalUrl = response.data.approval_url;
      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        console.error('Approval URL is undefined.');
      }
    } catch (err) {
      console.error("Swish setup error:", err);
      alert("Swish setup failed. Please check your phone number and try again.");
    }
  };

  const handlePayPalPayment = async () => {
    try {
      const token = localStorage.getItem('access_token');
  
      const response = await axios.post(
        '/payment/paypal/setup/',
        {
          email,
          amount: cart.total_price,
          // You can optionally include order_id or cart_id here if available
          order_id: orderId
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
  
      const { approval_url } = response.data;
  
      if (approval_url) {
        window.location.href = approval_url;
      } else {
        alert('PayPal setup failed: Missing approval URL.');
      }
    } catch (error) {
      console.error('PayPal setup error:', error);
      alert('Something went wrong while setting up PayPal.');
    }
  };  
  
  interface SetupPaymentResponse {
    approval_url?: string;
  }


  const handlePayment = async (method: string) => {
    setLoading(true);
    switch (method) {
      case 'stripe':
        await handleStripePayment();
        break;
      case 'paypal':
        await handlePayPalPayment();
        break;
      case 'swish':
        await handleSwishPayment();
        break;
      default:
        alert('Unsupported payment method');
    }
    setLoading(false);
  };
  

  return (
    <div className='payment-container'>
      <h2 className='title'>Choose Payment Method</h2>
      <div className='section'>
        {paymentOptions.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handlePayment(id)}
            disabled={loading}
            className='button'
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
      
      <p className='total'>Total to Pay: ${cart.total_price.toFixed(2)}</p>
    </div>
  );
};

export default PaymentMethods;
