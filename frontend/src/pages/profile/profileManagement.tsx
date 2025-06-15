import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import Profile from './profile';
import ProfileShippingInfo from './profileShippingInfo';
import './profileManagement.css';
import AdminPage from '../admin/adminPage';
import ProfileInvoices from './profileInvoice';
import ProfileOrderList from './profileOrders';
import { toast } from 'react-toastify';

const ProfileManagement:React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));

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

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    const renderTabs = () => {
      const buttons = [
        { name: 'profile' },
        { name: 'shipping address' },
        { name: 'orders'},
        { name: 'wishlist' },
        { name: 'invoices' },
        { name: isLoggedIn ? 'Logout' : '', to: '', onClick: handleLogout },
        { name: 'settings' },
      ].filter(button => button.name);

      return (
        <div className="profile-tab-container">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(button.name);
                if (button.onClick) {
                  button.onClick();
                }
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
  
    return (
      <div className="profile-management">
        <div className="container">
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
