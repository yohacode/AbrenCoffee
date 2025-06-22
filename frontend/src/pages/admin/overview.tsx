import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import './overview.css';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
import { toast } from 'react-toastify';
  
const Overview:React.FC = () => {
    const [topProducts, setTopProducts] = useState<
    { id: number; name: string; popularity: number; sales: number }[]>([]);
    const [dailySales, setDailySales] = useState<{ day: string; total_sales: number }[]>([]);
    const [products, setProducts] = useState(0);
    const [stock, setStock] = useState(0);
    const [sales, setSales] = useState(0);
    const [orders, setOrders] = useState(0);
    const [refunds, setRefunds] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [users, setUsers] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const productsPerPage = 5;

    useEffect(() => {
        const fetchAllStats = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            if (!token) {
            setError('You must be logged in.');
            setIsLoading(false);
            return;
        }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            try {
                const [
                    productsRes,
                    stockRes,
                    salesRes,
                    usersRes,
                    ordersRes,
                    completedOrdersRes,
                    topProductsRes,
                    salesPerDayRes,
                    refundsRes,
                ] = await Promise.all([
                    axios.get('/adminPanel/total-products/', config),
                    axios.get('/adminPanel/total-stock/', config),
                    axios.get('/adminPanel/total-sales/', config),
                    axios.get('/adminPanel/users/', config),
                    axios.get('/adminPanel/total-orders/', config),
                    axios.get('/adminPanel/completed_orders/', config),
                    axios.get('/adminPanel/top-products/', config),
                    axios.get('/adminPanel/sales-per-day/', config),
                    axios.get('/adminPanel/total-refunds/', config),
                ]);

                setProducts(productsRes.data.total_products);
                setStock(stockRes.data.total_stock);
                setSales(salesRes.data.total_sales);
                setUsers(usersRes.data.length);
                setOrders(ordersRes.data.total_orders);
                setCompletedOrders(completedOrdersRes.data.total_completed_orders);
                setTopProducts(topProductsRes.data);
                setDailySales(salesPerDayRes.data.sales_per_day || []);
                setRefunds(refundsRes.data);
            } catch {
                toast.error('Error fetching admin data:');
                setError('Failed to load admin statistics.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    const filteredSales = dailySales.filter((sale) => (
        sale.total_sales > 0 && sale.day.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    // Filter top products based on search term
    const indexOfLastSale = currentPage * productsPerPage;
    const indexOfFirstSale = indexOfLastSale - productsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

    const totalSalesPages = Math.ceil(filteredSales.length / productsPerPage);

    const filteredProducts = topProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Calculate pagination for top products
    const currentPageProducts = currentPage > 0 ? currentPage : 1;
    const indexOfLastProduct = currentPageProducts * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
    if (isLoading) return <div className="main">Loading...</div>;

  return (
    <div className='overview'>
        <div className="cards-container ">
            {error && <div className="alert alert-danger w-100 text-center">{error}</div>}
                <div className="cards">
                    <div className="card">
                        <p>{products}</p>
                        <h2>Total Products</h2>
                        <small className={stock < 10 ? 'less-stock' : ''}>
                            <p>Stock</p>
                            <p>{stock}</p>
                        </small>
                    </div>                  
                    <div className="card">
                        <p>${sales}</p>
                        <h2>Total Sales</h2>
                        <small>
                            <p>Refund</p>
                            <p>${refunds}</p>
                        </small>
                    </div>
                    <div className="card">
                        <p>{users}</p>
                        <h2>Total Users</h2>
                        <small>
                            <p>New</p>
                            <p>0</p>
                        </small>
                    </div>
                    <div className="card">
                        <p>{orders > 0 ? orders.toLocaleString() : '0'}</p>
                        <h2>Total Orders</h2>
                        <small>
                            <p>Completed</p>
                            <p>{completedOrders}</p>
                        </small>
                    </div>
                </div>
    
            <div className="users-top-products">
                <div className="top-products">
                    <div className="top-product-head">
                        <h3>Top Products</h3>
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Popularity</th>
                            <th>Sales</th>
                        </tr>
                        </thead>
                        <tbody>
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                <tr key={product.id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.popularity}%</td>
                                    <td>${product.sales.toLocaleString()}</td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td colSpan={4} className="text-center">
                                    No top products found.
                                </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

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

                <div className="sales-per-day">
                    <h3>Sales Per Day</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSales.length > 0 ? (
                                currentSales.map((sale, index) => (
                                    <tr key={index}>
                                        <td>{sale.day}</td>
                                        <td>${sale.total_sales}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2}>No daily sales data found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                     {/* Pagination */}
                    <div className="pagination">
                        {[...Array(totalSalesPages).keys()].map((page) => (
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
            </div>
            <div className="sales-chart">
              <div className="sales-per-day-chart">
                <h3>Sales Per Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total_sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Overview
