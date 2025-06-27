import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import './invoice.css';
import ConfirmModal from '../../../component/confirmDelete';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaPen } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';

interface Invoice {
  id: number;
  order: number;
  created_at: string;
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  pdf_file?: string; // Optional property for the PDF file URL
}

const Invoices: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const invoicePage = 5;

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/orders/invoices/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setInvoices(response.data);
      console.log('Invoices loaded:', response.data);
    } catch (err) {
      console.error('Error loading invoices:', err);
      toast.error('❌ Failed to load invoices');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDeleteClick = () => setShowConfirm(true);

  const handleConfirmDelete = async (id: number) => {
    setShowConfirm(false);
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`/orders/invoices/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Invoice deleted successfully!');
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    } catch {
      toast.error('❌ Failed to delete invoice.');
    }
  };

  const filteredInvoices = invoices.filter((invoice)=>
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastOrder = currentPage * invoicePage
  const indexOfFirstOrder = indexOfLastOrder - invoicePage
  const currentInvoice = filteredInvoices.slice(indexOfFirstOrder, indexOfLastOrder)

  const totalPages = Math.ceil(filteredInvoices.length/invoicePage);

  return (
    <div className="invoices-list-container">
      <h2>All Invoices</h2>

      <input
        type="text"
        placeholder="Search by status..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="invoice-search-input"
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '250px' }}
      />
  
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice ID</th>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoice.map((invoice, index) => (
              <tr key={invoice.id}>
                <td>{index + 1 + (currentPage - 1) * invoicePage}</td>
                <td>{invoice.id}</td>
                <td>{invoice.order}</td>
                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                <td>{invoice.status}</td>
                <td className="action-buttons">
                  <button title='detail' onClick={() => navigate(`/adminPage/invoices/detail/${invoice.id}`)}><FaEye/></button>
                  <button title='edit' onClick={() => alert(`Editing ${invoice.id}`)}><FaPen/></button>
                  <button title='delete' onClick={handleDeleteClick}><FaTrashCan/></button>
                  {invoice.pdf_file && (
                    <a
                      href={invoice.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="download-link"
                    >
                      <button>Download</button>
                    </a>
                  )}
                  <ConfirmModal
                    isOpen={showConfirm}
                    title="Delete order"
                    message="Are you sure you want to delete this order? This action cannot be undone."
                    onConfirm={() => handleConfirmDelete(invoice.id)}
                    onCancel={() => setShowConfirm(false)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {invoices.length === 0 && !loading && (
        <p>No invoices found.</p>
      )}
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

export default Invoices;
