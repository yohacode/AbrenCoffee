import React, { useEffect, useState } from 'react';
import './sidebar.css';
import './topnav.css';
import './adminPage.css';
import '../../styles/admintabButtons.css';
import TopNav from './topnav';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useNavVisibility } from '../../context/NavVisibilityContext';
import axios from '../../utils/axios';

import Sidebar from './sidebar';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  date_joined: string;
}

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setShowNav, setShowFooter } = useNavVisibility();
  const navigate = useNavigate();

  useEffect(() => {
    setShowNav(false);
    setShowFooter(false);
    return () => {
      setShowNav(true);
      setShowFooter(true);
    };
  }, [setShowNav, setShowFooter]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {
          localStorage.removeItem('access_token');
          navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <div className="main">Verifying admin access...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="admin-page">
      <Sidebar/>
      
      {error && <div className="alert alert-danger w-100 text-center">{error}</div>}
      <div className="admin-content">
        <TopNav />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
