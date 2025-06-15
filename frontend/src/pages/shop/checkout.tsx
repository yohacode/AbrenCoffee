import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import ShippingFormData from '../../component/checkout/ShippingForm';
import Review from '../../component/checkout/Review';
import PaymentMethods from '../../component/checkout/PaymentMethods';
import '../../component/checkout/CheckoutStepper.css';
import './checkout.css';
import { useNavVisibility } from '../../context/NavVisibilityContext';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  total_price: number;
}

interface Cart {
  id: number;
  cart_items: CartItem[];
  total_price: number;
}

type Step = 0 | 1 | 2;

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address1: '',
    address2: '',
    city: '',
    street: '',
    state: '',
    country: '',
    zipcode: '',
  });

  const [shippingAddressId, setShippingAddressId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>(0); // Step 0, 1, or 2
  const { setShowNav, setShowFooter } = useNavVisibility();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const { data } = await axios.get<Cart>('/cart/', {
          headers,
          withCredentials: true,
        });

        const normalizedCart = {
          ...data,
          cart_items: data.cart_items.map(item => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
            total_price:
              item.total_price !== undefined && item.total_price !== null
                ? Number(item.total_price)
                : Number(item.price) * Number(item.quantity),
          })),
        };

        setCart(normalizedCart);
      } catch {
        toast.error('❌ Failed to load cart data.');
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post('/orders/shipping/create/', formData, {
        headers,
        withCredentials: true,
      });

      setShippingAddressId(data.id);
      setPhoneNumber(data.phone_number);
      setActiveStep(1);
      toast.success('✅ Shipping information saved.');
    } catch {
      toast.error('❌ Failed to save shipping info');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!shippingAddressId || !cart) {
      toast.error('Missing shipping address or cart.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post(
        '/orders/create/',
        {
          shipping_address_id: shippingAddressId,
          total_price: cart.total_price,
          phone_number: formData.phone_number,
          delivery_frequency: 'none',
        },
        { headers, withCredentials: true }
      );

      const newOrderId = data.order_id;
      setOrderId(newOrderId);
      setActiveStep(2);
      toast.success('✅ Order created successfully!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      setShowNav(false);
      setShowFooter(false);
      return () => {
        setShowNav(true);
        setShowFooter(true);
      };
    }, [setShowNav, setShowFooter]);

  return (
    <div className="checkout">
      <div className="checkout-container">

        <div className="accordion">
          {/* Shipping Form Section */}
          <div className={`accordion-section ${activeStep >= 0 ? 'active' : 'disabled'}`}>
            <h2 onClick={() => setActiveStep(0)}>1. Shipping Information</h2>
            {activeStep === 0 && cart && (
              <ShippingFormData
                formData={formData}
                setFormData={setFormData}
                onChange={handleChange}
                onSubmit={handleShippingSubmit}
                loading={loading}
              />
            )}
          </div>

          {/* Review Section */}
          <div className={`accordion-section ${activeStep >= 1 ? 'active' : 'disabled'}`}>
            <h2 onClick={() => setActiveStep(1)}>2. Review Your Order</h2>
            {activeStep === 1 && cart && (
              <Review
                cart={cart}
                phoneNumber={phoneNumber}
                shippingAddressId={shippingAddressId as number}
                onBack={() => setActiveStep(0)}
                onConfirm={handleOrderSubmit}
                loading={loading}
              />
            )}
          </div>

          {/* Payment Section */}
          <div className={`accordion-section ${activeStep >= 2 ? 'active' : 'disabled'}`}>
            <h2 onClick={() => setActiveStep(2)}>3. Payment</h2>
            {activeStep === 2 && cart && orderId && (
              <PaymentMethods
                key={orderId}
                cart={cart}
                email={formData.email}
                phoneNumber={phoneNumber}
                loading={paymentLoading}
                setLoading={setPaymentLoading}
                orderId={orderId}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
