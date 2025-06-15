import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';

// Import react-pdf components
import { Document, Page, pdfjs } from 'react-pdf';

// Set pdfjs worker src (required for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Invoice {
  id: number;
  user: string;
  session_key: string;
  number: number;
  order: number;
  payment: string;
  created_at: string;
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  pdf?: string; // Optional property for the PDF file URL
}

const InvoiceDetail:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  // States for PDF rendering
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`/orders/invoices/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 200) throw new Error('invoice not found');
        setInvoice(response.data);
      } catch (err: unknown) {
        toast.error('Invoice not found! ' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // Callback when PDF document is loaded successfully
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  if (loading) return <div>Loading invoice details...</div>;
  if (!invoice) return <div>No invoice data available</div>;

  return (
    <div className="invoice-detail">
      <h2>Invoice Detail</h2>
      {invoice.pdf && (
        <a href={invoice.pdf} download target="_blank" rel="noopener noreferrer">
          Download Invoice PDF
        </a>
      )}

      <div className="invoice-detail-card">
        <div className="invoice-section">
          <p><strong>ID:</strong> {invoice.id}</p>
          <p><strong>Number:</strong> {invoice.number}</p>
          <p><strong>User:</strong> {invoice.user}</p>
          <p><strong>Session_key:</strong> {invoice.session_key}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Payment:</strong> {invoice.payment}</p>
          <p><strong>Order:</strong> {invoice.order}</p>
          <p><strong>Created At:</strong> {invoice.created_at}</p>
        </div>

        <div className="invoice-pdf">
          {invoice.pdf ? (
            <div className="pdf-preview">
              <strong>Invoice Preview:</strong>
              <Document
                file={invoice.pdf}
                onLoadSuccess={onDocumentLoadSuccess}
                loading="Loading PDF..."
                error="Failed to load PDF"
              >
                <Page pageNumber={pageNumber} />
              </Document>

              {numPages && numPages > 1 && (
                <div className="pdf-controls" style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber === 1}
                    style={{ marginRight: '1rem' }}
                  >
                    Previous
                  </button>
                  <span>
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
                    disabled={pageNumber === numPages}
                    style={{ marginLeft: '1rem' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p><strong>PDF:</strong> Not available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
