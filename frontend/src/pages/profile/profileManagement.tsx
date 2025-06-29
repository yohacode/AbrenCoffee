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
import Wishlist from './profileWishlist';
import { FaArrowDown, FaArrowUp} from 'react-icons/fa';
import userImage from '../../assets/images/images/menu-4.jpg';
import MySubscriptions from './MySubscriptions';

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
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    // Edit mode state
      const [editingField, setEditingField] = useState<string | null>(null);
      const [editedValue, setEditedValue] = useState<string>('');
    

    const handleToggleClicked = () => {
      setIsClicked(!isClicked);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("You must be logged in to view your profile.");
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/users/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch{
                setError("Failed to load profile.");
                navigate('/login');
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
        { name: 'subscriptions' },
      ].filter(button => button.name);

      return (
        <div className={isClicked ? "profile-tab-container small" : "profile-tab-container"}>
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
        case 'wishlist':
          return <Wishlist />
        case 'orders':
          return <ProfileOrderList />
        case 'subscriptions':
          return <MySubscriptions />
        default:
          return <Profile />;
      }
    };

    if (error) return <div className="error-message">{error}</div>;
  
    const startEditing = (field: keyof User) => {
      if (!user) return;
      setEditingField(field);
      setEditedValue(String(user[field]));
    };

    const cancelEditing = () => {
      setEditingField(null);
      setEditedValue('');
    };

    const saveEdit = async () => {
      if (!user || !editingField) return;

      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.patch(
          `/users/update/${user.id}/`,
          { [editingField]: editedValue },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setEditingField(null);
        setEditedValue('');
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert('Update failed: ' + err.message);
        } else {
          alert('Update failed: An unknown error occurred');
        }
      }
    };

    return (
      <div className="profile-management">
        <div className="container">
          <div className={isClicked ? "tabs show" : "tabs"}>
            {renderTabs()}
          </div>
          <div className="bars" onClick={handleToggleClicked}>
            {isClicked ? <FaArrowDown/> : <FaArrowUp/>}
          </div>
          <div className="profile">
            <div className="profile-container">
                {editingField === 'image' ? (
                  <>
                    <input
                      title='image'
                      type="file"
                      accept="image/*"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                    />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <img
                      src={
                        user?.profile_image
                          ? user.profile_image
                          : userImage
                      }
                      alt="Profile"
                      className="proImage"
                      loading="lazy"
                    /> 
                    <button onClick={() => startEditing('profile_image')}>Edit</button>
                  </>
                )}

            </div> 
          </div>
          <div className="contents">
            {renderContent()}
          </div>
          
        </div>
      </div>
    );
  };

export default ProfileManagement;
