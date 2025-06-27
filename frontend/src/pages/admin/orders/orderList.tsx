import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import ConfirmModal from '../../../component/confirmDelete';

interface Order {
  id: number;
  user: string;
  session_key: string;
  created_at: string;
  status: string;
  total_price: number;
  refundRequested?: boolean;
  refund_status?: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const ordersPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllOrders = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/adminPanel/orders/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
    };

    fetchAllOrders();
  }, []);

  const handleDeleteClick = (id: number) => {
    setOrderToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete === null) return;

    setShowConfirm(false);
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`/orders/delete/${orderToDelete}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Invoice deleted successfully!');
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderToDelete));
    } catch {
      toast.error('❌ Failed to delete order.');
    } finally {
      setOrderToDelete(null);
    }
  };

  const processRefund = async (orderId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`/orders/${orderId}/process-refund/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Refund processed successfully!');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, refund_status: 'processed', status: 'refunded' }
            : order
        )
      );
    } catch {
      toast.error('❌ Failed to process refund.');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrder = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className='order-list'>
      <h2>All Orders</h2>

      <input
        type="text"
        placeholder="Search by status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '5px', width: '200px' }}
      />

      <div className='order-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Id</th>
              <th>User</th>
              <th>Session key</th>
              <th>Status</th>
              <th>Total price</th>
              <th>Refund Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.length > 0 ? (
              currentOrder.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                  <td>{order.id}</td>
                  <td>{order.user}</td>
                  <td>{order.session_key}</td>
                  <td>{order.status}</td>
                  <td>{order.total_price}</td>
                  <td>
                    {order.refundRequested ? (
                      <span>
                        {order.refund_status === 'processed' ? 'Processed' : 'Requested'}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <button
                      title='View'
                      className="btn-edit"
                      onClick={() => navigate(`/adminPage/orders/detail/${order.id}`)}
                    >
                      <FaEye />
                    </button>
                    <button
                      title='Delete'
                      className="btn-delete"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      🗑️
                    </button>
                    {order.refundRequested && order.refund_status === 'requested' && (
                      <button
                        className="btn-refund"
                        onClick={() => processRefund(order.id)}
                      >
                        Process Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? Only Pending orders can be deleted. This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default OrderList;
