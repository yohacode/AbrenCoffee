import React, { useState } from 'react';
import {
  FaArrowCircleRight,
  FaCartPlus,
  FaClipboard,
  FaClock,
  FaFileInvoice,
  FaProductHunt,
  FaUser,
} from 'react-icons/fa';
import { FaAnglesLeft, FaAnglesRight, FaArrowRightToCity, FaGear} from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/images/logo.png';
import { Link } from 'react-router-dom';

// Sidebar Component
const Sidebar: React.FC = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleClicked = () => {
    setIsClicked(!isClicked);
  };

  const links = [
    { name: 'Dashboard', path: '/adminPage/overview', icon: <FaClock /> },
    { name: 'Users', path: '/adminPage/users', icon: <FaUser /> },
    { name: 'Products', path: '/adminPage/products', icon: <FaProductHunt /> },
    { name: 'Orders', path: '/adminPage/orders', icon: <FaCartPlus /> },
    { name: 'Invoices', path: '/adminPage/invoices', icon: <FaFileInvoice /> },
    { name: 'Blog', path: '/adminPage/blog', icon: <FaGear /> },
    { name: 'Subscriptions', path: '/adminPage/subscriptions', icon: <FaClipboard /> },
    { name: 'Report', path: '/adminPage/report', icon: <FaClipboard /> },
    { name: 'Help', path: '/adminPage/help', icon: <FaArrowRightToCity /> }
  ];

  return (
    <>    
        <div className="sidebar-toggle" onClick={() => handleClicked()}>
          {isClicked ? <FaAnglesRight /> : <FaAnglesLeft />}
        </div> 
      <aside className={isClicked ? "sidebar shrink" : 'sidebar'}> 
        <div className="sidebar-header">
          <Link to={'/'}><img src={logo} alt="" /></Link>
        </div>
        <nav>
          <ul className="sidebar-links">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className='sidebar-icon'>{link.icon}</span>
                  <span className={isClicked ? 'name' : ''}>{link.name}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button className={isClicked ? 'sidebar-link logout-button' : ""} onClick={handleLogout}>
                <FaArrowCircleRight />
                <span className={isClicked ? 'name' : ''}>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>   
  );
};

export default Sidebar;
