import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './userManagement.css';

const UsersManagement:React.FC = () => {
  const [activeTab, setActiveTab] = useState('List');
  
    const renderTabs = () => {
      const buttons = [
        { name: 'List', to: '/admin/users' },
        { name: 'Add User', to: '/admin/users/add'}
      ];

      return (
        <div className="tab-container">
          {buttons.map((button, index) => (
            <Link
              key={index}
              to={button.to}
              onClick={()=> setActiveTab(button.name)}
              className={activeTab === button.name ? 'link active' : 'link'}
            >
              {button.name}
            </Link>
          ))}
        </div>
      );
    };

  return (
    <div className="user-management">
      {renderTabs()}
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersManagement;
