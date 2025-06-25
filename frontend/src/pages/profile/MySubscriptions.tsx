import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import './MySubscriptions.css';

interface Subscription {
  id: number;
  provider: string;
  external_id: string;
  active: boolean;
  created_at: string;
}

const MySubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const fetchSubscriptions = async () => {
      const res = await axios.get<Subscription[]>('/my-subscriptions/');
      setSubscriptions(res.data);
    
  };

  const cancelSubscription = async (id: number) => {

      await axios.post(`/subscriptions/${id}/cancel/`);
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: false } : s))
      );
    
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="subscription-dashboard">
      <h2>My Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <table className="subscription-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Subscription ID</th>
              <th>Status</th>
              <th>Started At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
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
                    <button onClick={() => cancelSubscription(sub.id)} className="cancel-btn">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySubscriptions;
