import React from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa'; // Importing specific icons

const Sidebar: React.FC = () => {
  const links = [
    { link: '../pages/profile.tsx', icon: <FaUser /> },  // Using FaUser icon
    { link: '../pages/shop/cart.tsx', icon: <FaShoppingCart /> }  // Using FaShoppingCart icon
  ];

  return (
    <div className="sidebar">
      {links.map((link, index) => (
        <div className="link-group" key={index}>
          <a href={link.link} className="link">
            <span className="icon">{link.icon}</span>  {/* Displaying icon */}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
