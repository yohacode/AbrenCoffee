import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './productManagement.css';

const ProductManagement:React.FC = () => {
  const [activeTab, setActiveTab] = useState('List');
    
      const renderTabs = () => {
        const buttons = [
          { name: 'List', to: '/adminPage/products' },
          { name: 'Add Product', to: '/adminPage/products/add'}
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
    <div className="product-management">
      {renderTabs()}
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductManagement;
