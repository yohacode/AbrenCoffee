import React, { useEffect, useState } from 'react';
import './Report.css';
import axios from '../../../utils/axios';
import SalesTrendChart from './SalesTrendChart';
import UserEngagementChart from './UserEngagementChart';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Report:React.FC = () => {
  const [salesRange, setSalesRange] = useState('6m');
  const [refund, setRefund] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const [sales, setSales] = useState(0);
  const [topProducts, setTopProducts] = useState<
    { id: number; name: string; popularity: number; sales: number }[]
  >([]);
  const [siteVisits, setSiteVisits] = useState(0);
  const [topViewedProducts, setTopViewedProducts] = useState<{ path: string; count: number }[]>([]);
  const [topReferrers, setTopReferrers] = useState<{ referrer: string; count: number }[]>([]);

  interface RecentOrder {
    id: number;
    user: string;
    created_at: string;
    total_price: number;
    status: string;
  }
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  // Pagination states
  const [topViewedPage, setTopViewedPage] = useState(1);
  const [referrersPage, setReferrersPage] = useState(1);
  const [topProductsPage, setTopProductsPage] = useState(1);
  const [recentOrdersPage, setRecentOrdersPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllStats = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const [
          productsRes,
          salesRes,
          usersRes,
          ordersRes,
          topProductsRes,
          visitorAnalyticsRes,
          recentOrdersRes,
          refundRes,
        ] = await Promise.all([
          axios.get('/adminPanel/total-products/', config),
          axios.get('/adminPanel/total-sales/', config),
          axios.get('/adminPanel/users/', config),
          axios.get('/adminPanel/total-orders/', config),
          axios.get('/adminPanel/top-products/', config),
          axios.get('/adminPanel/visitor-analytics/', config),
          axios.get('/adminPanel/recent-orders/', config),
          axios.get('/adminPanel/total-refunds/', config),
        ]);

        setProducts(productsRes.data.total_products);
        setSales(salesRes.data.total_sales);
        setUsers(usersRes.data.length);
        setOrders(ordersRes.data.total_orders);
        setTopProducts(topProductsRes.data);
        setRecentOrders(recentOrdersRes.data.recent_order_data);
        setRefund(refundRes.data);

        // Correct Site Visits: sum of visits_per_day counts!
        const visitsData = visitorAnalyticsRes.data.recent_visits_data || [];
        type VisitDay = { count: number };
        const totalVisits = visitsData.reduce((sum: number, day: VisitDay) => sum + day.count, 0);
        setSiteVisits(totalVisits);

        setTopViewedProducts(visitorAnalyticsRes.data.top_products || []);
        setTopReferrers(visitorAnalyticsRes.data.top_referrers || []);
      } catch{
        toast.error('Failed to load admin statistics.');
      }
    };

    fetchAllStats();
  }, []);

  // Pagination helpers
  const paginate = <T,>(data: T[], page: number): T[] => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (dataLength: number, page: number, setPage: (page: number) => void) => {
    const totalPages = Math.ceil(dataLength / itemsPerPage);
    return (
      <div className="pagination">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="report-management">
      <div className="report-container">
        {/* Summary Cards */}
        <div className="report-summary-grid">
          {[
            { title: 'Total Sales', value: `$${sales}` },
            { title: 'Orders', value: orders },
            { title: 'New Customers', value: users },
            { title: 'Refunds', value: `$${refund}` },
            { title: 'Products Sold', value: products },
            { title: 'Site Visits', value: siteVisits },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              className="report-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{item.title}</h3>
              <p className={typeof item.value === 'number' && item.value > 0 ? '' : 'value'}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Monthly Sales Section */}
        <div className="report-section">
          <h2>📊 Monthly Sales Trend</h2>
          <div>
            <label>Range: </label>
            <select
              title="range"
              value={salesRange}
              onChange={(e) => setSalesRange(e.target.value)}
            >
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
          <SalesTrendChart range={salesRange} />
        </div>

        {/* User Engagement Section */}
        <div className="report-section">
          <h2>📈 User Engagement</h2>
          <UserEngagementChart />
        </div>

        {/* Top Viewed Products */}
        <div className="report-section">
          <h2>👀 Top Viewed Products</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Product URL</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {paginate(topViewedProducts, topViewedPage).map((product, idx) => (
                <tr key={idx}>
                  <td>{product.path}</td>
                  <td>{product.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(topViewedProducts.length, topViewedPage, setTopViewedPage)}
        </div>

        {/* Top Referrers */}
        <div className="report-section">
          <h2>🌐 Top Referrers</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Referrer</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {paginate(topReferrers, referrersPage).map((referrer, idx) => (
                <tr key={idx}>
                  <td>{referrer.referrer}</td>
                  <td>{referrer.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(topReferrers.length, referrersPage, setReferrersPage)}
        </div>

        {/* Top Products */}
        <div className="report-section">
          <h2>🏆 Top Products</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {paginate(topProducts, topProductsPage).map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.popularity}</td>
                  <td>${product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(topProducts.length, topProductsPage, setTopProductsPage)}
        </div>

        {/* Recent Orders */}
        <div className="report-section">
          <h2>🛒 Recent Orders</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginate(recentOrders, recentOrdersPage).map((order, index) => (
                <tr key={index}>
                  <td>#{order.id}</td>
                  <td>{order.user}</td>
                  <td>{order.created_at}</td>
                  <td>${order.total_price}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(recentOrders.length, recentOrdersPage, setRecentOrdersPage)}
        </div>
      </div>
    </div>
  );
};

export default Report;
