import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import './productList.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import ConfirmModal from '../../../component/confirmDelete';

interface Product {
  id: string;
  name:string;
  price: number;
  category: string;
  stock: string;
  quantity: number;
  created_at: string;
}

const ProductList: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllProducts = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/products/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data);
    };

    fetchAllProducts();
  }, []);

  const handleDeleteClick = () => setShowConfirm(true);

  const handleConfirmDelete = async (id: number) => {
    setShowConfirm(false);
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`/products/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Invoice deleted successfully!');
      setProducts(products.filter((product) => product.id !== id.toString()));
    } catch {
      toast.error('❌ Failed to delete invoice.');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  return (
    <div className='product-list'>
      <h2>All Products</h2>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      <div className='product-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Catagory</th>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index)=>(
                <tr key={product.id}>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td className={product.stock.length < 10 ? 'less-stock' : ''}>{product.stock}</td>
                  <td>{product.quantity}kg</td>
                  <td>{product.created_at}</td>
                  <td>
                    <button
                      title='view'
                      className="btn-edit"
                      onClick={() => navigate(`/admin/products/detail/${product.id}`)}
                      >
                      <FaEye />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={handleDeleteClick}
                    >
                      🗑️
                    </button>
                  </td>
                  <ConfirmModal
                    isOpen={showConfirm}
                    title="Delete order"
                    message="Are you sure you want to delete this order? This action cannot be undone."
                    onConfirm={() => handleConfirmDelete(Number(product.id))}
                    onCancel={() => setShowConfirm(false)}
                  />
                </tr>
              ))
            ) : (
              <tr>
              <td colSpan={6} className="text-center">
                No Product found.
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

export default ProductList;

