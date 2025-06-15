import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import './profileShippingInfo.css'

interface Shipping {
    session_key: string;
    full_name: string;
    email: string;
    user: string;
    address1: string;
    address2: string;
    city: string;
    status: string;
    zipcode: number;
    country: string;
}

const ProfileShippingInfo:React.FC = () => {
    const [shippingAddress, setShippingAddress] = useState<Shipping | null>(null);
    
    useEffect(() => {
        const fetchShipping = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            try {
                const response = await axios.get('/orders/shipping/user/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Shipping Response:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setShippingAddress(response.data[0]); // If it's a list, take the first
                } else {
                    setShippingAddress(null);
                }
            } catch  {
                toast.error("Shipping fetch failed:");
            }
        };

        fetchShipping();
    }, []);

  return (
    <div>
      <div className="profile-shipping-container">
        <h2>Shipping Address</h2>
            {shippingAddress ? (
                <div className='shipping-details'>
                    <p><strong>Name:</strong> {shippingAddress.full_name}</p>
                    <p><strong>Email:</strong> {shippingAddress.email}</p>
                    <p><strong>Address 1:</strong> {shippingAddress.address1}</p>
                    <p><strong>Address 2:</strong> {shippingAddress.address2}</p>
                    <p><strong>City:</strong> {shippingAddress.city}</p>
                    <p><strong>Status:</strong> {shippingAddress.status}</p>
                    <p><strong>Zipcode:</strong> {shippingAddress.zipcode}</p>
                    <p><strong>Country:</strong> {shippingAddress.country}</p>
                </div>
            ) : (
                <p className='no-address'>No shipping address found.</p>
            )}
        </div>
    </div>
  )
}

export default ProfileShippingInfo
