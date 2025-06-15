import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const getProducts = () =>
  axios.get(`${API_BASE}/products/list/`).then(res => res.data);

export const addToCart = (productId: number) => {
    const token = localStorage.getItem('access_token');
    return axios.post(
      `${API_BASE}/cart/add-cart/`,
      { product: productId, quantity: 1 },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      }
    ).then(res => res.data)
      .catch(err => {
        if (err.response && err.response.data.error === 'Conflict') {
            alert('This product is already in your cart!');
          } else {
            console.error('Failed to add to cart:', err);
          }
      });
  };
  

