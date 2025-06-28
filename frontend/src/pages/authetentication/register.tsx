import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './register.css'
import PasswordInput from '../../component/viewPassword';

const Register: React.FC = () => {
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
      await axios.post('/api/register/', formData);
      // You might want to redirect or show success message here
      toast.success('Subscribed successfully!')
      navigate('/');
    } catch{
      toast.error('Registration failed');
    }

  };

  return (
    <div className='register-container'>
      <form onSubmit={handleRegister} className="register-box">
        <PasswordInput
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="register-input"
          required
        />
        <PasswordInput
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="register-input"
          required
        />
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="register-input"
          required
        />
        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registering...' : 'Submit'}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
