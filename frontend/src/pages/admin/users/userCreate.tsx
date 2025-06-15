import React, { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import CreateRole from './createRole';
import Select from 'react-select';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';

interface Role {
  id: number;
  name: string;
  }

interface SelectOption {
  label: string;
  value: string | number;
}

const UserCreate:React.FC = () => {
  const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      role: '',
    });
  
    const [role, setRole] = useState<SelectOption[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
  
    // Load roles
    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const res = await axios.get('/users/role/list/');
          setRole(res.data.map((role: Role) => ({ label: role.name, value: role.id })));
        } catch {
          toast.error('❌ Failed to load roles');
        }
      };
  
      fetchRoles(); // fetch roles when component mounts or isOpen changes
    }, [isOpen]); // reload if new role created
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, type, value, checked, files } = e.target as HTMLInputElement;
          if (type === 'file' && files?.[0]) {
            setFormData(prev => ({ ...prev, image: files[0] }));
          } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
          } else {
            setFormData(prev => ({ ...prev, [name]: value }));
          }
        };
  
    const handleRoleChange = (selected: SelectOption | null) => {
      setFormData(prev => ({
        ...prev,
        role: selected ? String(selected.value) : '',
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      const token = localStorage.getItem('access_token');
      const form = new FormData();
  
      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('password', String(formData.password));
      form.append('role', String(formData.role));
  
  
      try {
        await axios.post('/users/create/', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        toast.success('✅ User Added successfully!');
        setFormData({
          username: '',
          role: '',
          email: '',
          password: '',
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        toast.error('❌ Failed to create user. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleOpen = () => {
      setIsOpen(!isOpen);
    }
  
    const onClose = () => {
      setIsOpen(!isOpen);
    }
  
    const CategoryCreate = () =>{
      return(
          <div className='category-create'>
              <button className="close-btn" onClick={onClose}>×</button>
              <CreateRole />
          </div>
      )
    }
  
    return (
      <>
        <form onSubmit={handleSubmit} className="user-form">
          <h2>Add New User</h2>
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              title='username'
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
  
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              title='email address'
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              title='password'
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
  
          <div className="form-group">
            <Select
              placeholder="Select role"
              options={role}
              onChange={handleRoleChange}
              className="form-select"
              value={role.find(opt => opt.value === Number(formData.role)) || null}
            />
            <button type="button" className="add-category-btn" onClick={() => handleOpen()}>
              <FaPlus /> Add Role
            </button>
          </div>
  
          <button type="submit" disabled={loading} className="form-button">
            {loading ? 'Submitting...' : 'Add User'}
          </button>
        </form>
  
        {isOpen && (
          <div className="category-create-modal">
            {CategoryCreate()}
          </div>
        )}
      </>
    );
  };

export default UserCreate
