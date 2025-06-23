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
    { name: 'Dashboard', path: '/admin/overview', icon: <FaClock /> },
    { name: 'Users', path: '/admin/users', icon: <FaUser /> },
    { name: 'Products', path: '/admin/products', icon: <FaProductHunt /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaCartPlus /> },
    { name: 'Invoices', path: '/admin/invoices', icon: <FaFileInvoice /> },
    { name: 'Blog', path: '/admin/blog', icon: <FaGear /> },
    { name: 'Report', path: '/admin/report', icon: <FaClipboard /> },
    { name: 'Help', path: '/admin/help', icon: <FaArrowRightToCity /> }
  ];

  return (
    <>     
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
      <div className={isClicked ? 'back-button' : "back-button"} onClick={() => handleClicked()}>
        {isClicked ? <FaAnglesRight /> : <FaAnglesLeft/>}
      </div>
    </>   
  );
};

export default Sidebar;
