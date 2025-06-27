import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ordermanagement.css';

const OrderManagement:React.FC = () => {
   const [activeTab, setActiveTab] = useState('List');
    
      const renderTabs = () => {
        const buttons = [
          { name: 'List', to: '/adminPage/orders' },
          { name: 'Add Order', to: '/adminPage/orders/add'}
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
    <div className="order-management">
      {renderTabs()}
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default OrderManagement;
