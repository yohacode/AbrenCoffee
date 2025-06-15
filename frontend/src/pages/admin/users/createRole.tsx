import React, {  useRef, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './createRole.css';


const CreateRole: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',

  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked, files } = e.target;
    if (type === 'file' && files?.[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('access_token');
    const form = new FormData();

    form.append('name', formData.name);

    try {
      await axios.post('/users/role/create/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Role created successfully!');
      setFormData({
        name: '',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      toast.error('❌ Failed to create role. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
        <form onSubmit={handleSubmit} className="category-form">
        <h2>Create Role</h2> {/* Updated header to match the context */}

        <div className="form-group">
            <input
            type="text"
            name="name"
            placeholder='name'
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
            />
        </div>

        <button type="submit" disabled={loading} className="role-form-button">
            {loading ? 'Submitting...' : 'Create Role'} {/* Updated button text to match the context */}
        </button>
        </form>
    </>
    
  );
};

export default CreateRole;
