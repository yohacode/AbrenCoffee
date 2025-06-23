import React from 'react';
import './help.css'; // optional: create help.css for styling

const Help: React.FC = () => {
  return (
    <div className="help-container">
      <h1>Admin Help & Support</h1>
      <p className="intro">
        Welcome to the Abren Coffee Admin Panel! Here’s a quick guide to help you manage your store efficiently.
      </p>

      <div className="help-section">
        <h2>📊 Overview Dashboard</h2>
        <ul>
          <li>
            <strong>Total Products:</strong> Displays the total number of products listed in the store.
          </li>
          <li>
            <strong>Stock:</strong> Indicates the current inventory. If stock is low (&lt; 10), it’s highlighted.
          </li>
          <li>
            <strong>Sales:</strong> Shows total sales revenue, including refund details.
          </li>
          <li>
            <strong>Orders:</strong> Total number of placed orders with a count of completed ones.
          </li>
          <li>
            <strong>Users:</strong> Displays the total number of registered users.
          </li>
          <li>
            <strong>Top Products:</strong> Sorted list based on popularity and sales. Use the search bar to filter.
          </li>
          <li>
            <strong>Sales Per Day:</strong> Shows a daily breakdown of sales in both table and line chart formats.
          </li>
        </ul>
      </div>

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

      <div className="help-section">
        <h2>🧾 Invoice System</h2>
        <ul>
          <li>
            <strong>Invoice Generation:</strong> Automatically created when an order is placed and paid.
          </li>
          <li>
            <strong>Invoice Details:</strong> Includes order ID, customer info, products, quantities, prices, and totals.
          </li>
          <li>
            <strong>Download PDF:</strong> Admins and customers can download invoices for records and tax purposes.
          </li>
          <li>
            <strong>Invoice Status:</strong> Reflects payment completion, pending status, or failed payments.
          </li>
          <li>
            <strong>Search & Filter:</strong> Quickly find invoices by customer name, order ID, or date range.
          </li>
          <li>
            <strong>Manual Edits:</strong> (Optional) Admins can correct or resend invoices in case of customer issues.
          </li>
        </ul>
      </div>

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
