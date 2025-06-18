import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import Profile from './profile';
import ProfileShippingInfo from './profileShippingInfo';
import './profileManagement.css';
import AdminPage from '../admin/adminPage';
import ProfileInvoices from './profileInvoice';
import ProfileOrderList from './profileOrders';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_joined: string;
    profile_image: string; // Added property
}

const ProfileManagement:React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("You must be logged in to view your profile.");
               
                return;
            }

            try {
                const response = await axios.get('/users/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch{
                setError("Failed to load profile.");
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            try {
                await axios.get('/users/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch{
                    localStorage.removeItem('access_token');
                    toast.error("Failed to load profile.");
            }
        };

        fetchUserData();
    }, []);

    const renderTabs = () => {
      const buttons = [
        { name: 'profile' },
        { name: 'shipping address' },
        { name: 'orders'},
        { name: 'wishlist' },
        { name: 'invoices' },
        { name: 'settings' },
      ].filter(button => button.name);

      return (
        <div className="profile-tab-container">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(button.name);
                
              }}
              className={activeTab === button.name ? 'active' : ''}
            >
              {button.name}
            </button>
          ))}
        </div>
      );
    };
  
    const renderContent = () => {
      switch (activeTab) {
        case 'Profile':
          return <Profile/>;
        case 'shipping address':
          return <ProfileShippingInfo/>;
        case 'dashboard':
            return <AdminPage />
        case 'invoices':
          return <ProfileInvoices />
        case 'orders':
          return <ProfileOrderList />
        default:
          return <Profile />;
      }
    };

    if (error) return <div className="error-message">{error}</div>;

  
    return (
      <div className="profile-management">
        <div className="container">
          <div className="profile">
            <div className="profile-container">
                <img src={`http://127.0.0.1:8000${user?.profile_image}`} alt="Profile" />  
            </div> 
          </div>
          <div className="contents">
            {renderContent()}
          </div>
          <div className="tabs">
            {renderTabs()}
          </div>
        </div>
      </div>
    );
  };

export default ProfileManagement;
