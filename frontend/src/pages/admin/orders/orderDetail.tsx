import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axios';

interface Order {
  id: number;
  user: string;
  session_key: string;
  created_at: string;
  status: string;
  total_price: number;
}

const OrderDetail:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`/adminPanel/admin_order_detail/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 200) throw new Error('order not found');
        setOrder(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert('Update failed: ' + err.message);
        } else {
          alert('Update failed: An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);


  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>No order data available</div>;

  return (
    <div className="user-detail">
      <h2>Order Detail</h2>
      <div className="detail-card">
        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>User:</strong> {order.user}</p>
        <p><strong>Session_key:</strong> {order.session_key}</p>
        <p><strong>Created At:</strong> {order.created_at}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Spent:</strong> {order.total_price}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
