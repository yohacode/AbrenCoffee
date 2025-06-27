import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './invoice.css';

const InvoiceManagement:React.FC = () => {
   const [activeTab, setActiveTab] = useState('List');
    
      const renderTabs = () => {
        const buttons = [
          { name: 'List', to: '/adminPage/invoices/' },
          { name: 'Add Invoice', to: '/adminPage/invoices/add'}
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
    <div className="invoices-container">
      {renderTabs()}
      <div className="list-container">
        <Outlet />
      </div>
    </div>
  );
};

export default InvoiceManagement;
