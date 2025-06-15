import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import './Refunds.css';

const AdminRefunds:React.FC = () => {
  const [refundOrders, setRefundOrders] = useState<RefundOrder[]>([]);

  useEffect(() => {
    const fetchRefundRequests = async () => {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('/orders/refund-requests/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefundOrders(res.data);
    };

    fetchRefundRequests();
  }, []);

interface RefundOrder {
    id: number;
    user?: string;
    total_price: number;
    refund_status: string;
}

const handleProcessRefund = async (orderId: number): Promise<void> => {
    try {
        const token = localStorage.getItem('access_token');
        await axios.post(`/orders/${orderId}/process-refund/`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert('Refund processed!');
        setRefundOrders((prev: RefundOrder[]) => prev.filter(order => order.id !== orderId));
    } catch {
        alert('Failed to process refund.');
    }
};

  return (
    <div className="refunds-container">
      <h1>Refund Requests</h1>
      {refundOrders.length === 0 ? (
        <p>No refund requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {refundOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user || 'User'}</td> {/* Add user field to serializer if needed */}
                <td>${order.total_price}</td>
                <td>{order.refund_status}</td>
                <td>
                  {order.refund_status === 'requested' && (
                    <button onClick={() => handleProcessRefund(order.id)}>Process Refund</button>
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

export default AdminRefunds;
