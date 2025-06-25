import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate, Link } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  email: string;
  role: string;
  date_joined: string;
}

const TopNav: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as { response?: { status?: number } }).response?.status === 401
        ) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('access_token');
          navigate('/login');
        } else {
          setError('Failed to load profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDropdown = (index: number) => {
    setOpenDropdown(prev => (prev === index ? null : index));
  };

  if (loading) return <div className="topnav-loading">Loading...</div>;
  if (error) return <div className="topnav-error">{error}</div>;

  const mainLinks = [
    {
      name: '',
      image: (
        <div className="topnav-profile-image">
          <img src={`http://127.0.0.1:8000/${user?.profile_image}`} alt={`${user?.first_name} ${user?.last_name}`} />
        </div>
      ),
      path: '#',
      sublinks: [
        { name: 'Profile', path: '/admin/profile' },
        { name: 'Logout', path: '/admin/logout' },
        { name: 'Help', path: '/admin/help' },
      ],
    },
  ];

  return (
    <nav className="topnav">
      <div className="topnav-left">
        <h2>{user?.username}</h2>
      </div>
      <div className={`topnav-right`}>
        <ul className="topnav-links">
          {mainLinks.map((link, index) => (
            <li key={index} className="topnav-item">
              <div
                role="button"
                className="topnav-link"
                onClick={() => link.sublinks && handleDropdown(index)}
              >
                {link.name} {link.image} 
              </div>
              {link.sublinks && openDropdown === index && (
                <ul className="topnav-sublinks">
                  {link.sublinks.map((sublink, subIndex) => (
                    <li key={subIndex} className="topnav-sublink-item">
                      <Link
                        to={sublink.path}
                        className="topnav-sublink-link"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sublink.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
