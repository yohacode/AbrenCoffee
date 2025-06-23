import React from 'react';
import './help.css'; // optional: create help.css for styling

const Help: React.FC = () => {
  return (
    <div className="help-container">
      <h1>Admin Help & Support</h1>
      <p className="intro">
        Welcome to the Abren Coffee Admin Panel! Here’s a quick guide to help you manage your store efficiently.
      </p>

      <section className="help-section">
        <h2>📦 Product Management</h2>
        <ul>
          <li><strong>Add Products:</strong> Go to <em>Products → Add New</em> to list new items.</li>
          <li><strong>Edit/Remove:</strong> From the product list, click “Edit” or “Delete” to manage existing items.</li>
          <li><strong>Stock Alerts:</strong> Keep an eye on low stock warnings in the dashboard.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>🛒 Orders & Sales</h2>
        <ul>
          <li><strong>View Orders:</strong> Navigate to <em>Orders</em> to see pending and completed orders.</li>
          <li><strong>Refunds:</strong> You can process or review refunds under the “Sales” tab.</li>
          <li><strong>Daily Sales:</strong> Check the sales chart for daily performance insights.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>📝 Blog Management</h2>
        <ul>
          <li><strong>Create or Edit Blogs:</strong> Add coffee insights, news, or stories in the <em>Blog</em> section.</li>
          <li><strong>Categories:</strong> Assign or create categories to organize content.</li>
          <li><strong>Image Upload:</strong> Use high-quality images (JPG, PNG) under 2MB for better performance.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>👥 Users</h2>
        <ul>
          <li><strong>Manage Users:</strong> View registered users and their activity from the <em>Users</em> tab.</li>
          <li><strong>Admin Roles:</strong> Only superusers can manage roles and permissions.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>🛠️ Troubleshooting</h2>
        <ul>
          <li>If the page isn't updating, try refreshing or clearing your browser cache.</li>
          <li>Check internet connection and backend server status.</li>
          <li>Make sure your access token is valid — you may need to log in again.</li>
          <li>Need more help? Contact support at <a href="mailto:support@abrencoffee.com">support@abrencoffee.com</a>.</li>
        </ul>
      </section>
    </div>
  );
};

export default Help;
