import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import './AdminSubscriptions.css';

interface User {
  id: number;
  email: string;
}

interface Subscription {
  id: number;
  user: User;
  provider: string;
  external_id: string;
  active: boolean;
  created_at: string;
}

const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/adminPanel/subscriptions/');
      setSubscriptions(res.data);
    } catch {
      setError('Failed to fetch admin subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const cancelSub = async (id: number) => {
    try {
      await axios.post(`/subscriptions/${id}/cancel/`);
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: false } : s))
      );
    } catch {
      alert('Failed to cancel subscription');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubs =
    filter === 'all'
      ? subscriptions
      : subscriptions.filter((s) => s.provider === filter);

  return (
    <div className="admin-subs">
      <h2>All Subscriptions</h2>

      <div className="filter-controls">
        <label htmlFor="provider-filter">Filter by Provider: </label>
        <select
          id="provider-filter"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">All</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="klarna">Klarna</option>
          <option value="swish">Swish</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Provider</th>
            <th>Subscription ID</th>
            <th>Status</th>
            <th>Started</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubs.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.user.id}</td>
              <td>{sub.user.email}</td>
              <td>{sub.provider}</td>
              <td>{sub.external_id}</td>
              <td>
                <span className={sub.active ? 'badge active' : 'badge inactive'}>
                  {sub.active ? 'Active' : 'Cancelled'}
                </span>
              </td>
              <td>{new Date(sub.created_at).toLocaleDateString()}</td>
              <td>
                {sub.active && (
                  <button onClick={() => cancelSub(sub.id)} className="cancel-btn">
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubscriptions;
