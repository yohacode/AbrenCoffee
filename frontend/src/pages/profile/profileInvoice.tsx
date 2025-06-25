import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import './profileInvoice.css';

interface Invoice {
  id: number;
  created_at: string;
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  pdf_file?: string; // Optional property for the PDF file URL
}

const ProfileInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/orders/invoices/user/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setInvoices(response.data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="invoices-container">
      <h1>All Invoices</h1>

        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                <td>{invoice.status}</td>
                <td className="action-buttons">
                  <button onClick={() => alert(`Viewing ${invoice.id}`)}>View</button>
                  <button onClick={() => alert(`Editing ${invoice.id}`)}>Edit</button>
                  <button onClick={() => alert(`Deleting ${invoice.id}`)}>Delete</button>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {invoices.length === 0 && (
        <p>No invoices found.</p>
      )}
    </div>
  );
  
};

export default ProfileInvoices;
