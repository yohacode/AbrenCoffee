import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import './homeRegister.css';

const HomeRegister:React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/register/', formData);
      console.log(response.data);
      // You might want to redirect or show success message here
      toast.success('Subscribed successfully!')
      navigate('/login');
    } catch {
      toast.error('Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className='home-register'>
      <div className="section-title">
       </div>
      <div className="section-register">
        <form onSubmit={handleRegister}>
          <h1><span>Subscribe</span> get 10% on your orders.</h1>
            <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="login-input"
            required
            />
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="login-input"
            required
            />
            <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="login-input"
            required
            />
            <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register Now'}
            </button>
            {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default HomeRegister
