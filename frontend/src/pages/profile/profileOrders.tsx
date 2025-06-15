import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import './profileOrders.css';
import { useNavigate } from 'react-router-dom';

interface Order {
    id: number;
    created_at: string;
    status: string;
    total_price: number;
    refundRequested?: boolean;
}

const ProfileOrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchAllOrders = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/orders/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
      console.log(response.data);
    };

    fetchAllOrders();
  }, []);


  const filteredOrders = orders;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrder = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


  const handleCancelOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`/orders/${orderId}/cancel/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success('Order cancelled and stock restored.');
  
      // Optionally re-fetch orders
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch {
      toast.error('Failed to cancel order.');
    }
  };

  const handleRequestRefund = async (orderId: number) => {
  try {
    const token = localStorage.getItem('access_token');
     await axios.post(`/orders/request-refund/${orderId}/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Refund request sent!');
    // Optionally update UI:
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, refundRequested: true } : order
    ));
  } catch{
    toast.error('Failed to request refund.');
  }
};

  return (
    <div className='order-list'>
      <h1>All Orders</h1>
      <div className='order-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Total price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentOrder.length > 0 ? (
              currentOrder.map((order, index)=>(
                <tr key={order.id}>
                  <td>{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                  <td>{order.status}</td>
                  <td>{order.total_price}</td>
                  <td>
                    {order.status === 'pending' ? (
                      <div className="pending-order-actions">
                        <button
                          onClick={() => navigate('/checkout/payment', { state: { orderId: order.id } })}
                          className="btn-primary"
                        >
                          💳 Resume Payment
                        </button>

                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="btn-secondary"
                        >
                          ❌ Cancel Order
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-edit"
                        title="View Order"
                        onClick={() => alert(`View details for order ${order.id}`)}
                      >
                        ✏️ Info
                      </button>
                    )}
                    {order.status === 'delivered' && !order.refundRequested && (
                      <button onClick={() => handleRequestRefund(order.id)}>Request Refund</button>
                    )}

                  </td>

                </tr>
              ))
            ) : (
              <tr>
              <td colSpan={6} className="text-center">
                No Orders found.
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => setCurrentPage(page + 1)}
            className={currentPage === page + 1 ? 'active' : ''}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileOrderList;
