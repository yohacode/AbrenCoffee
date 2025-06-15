import axios from '../../../utils/axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserUpdate: React.FC = () => {
  const { id } = useParams();
  const userId = Number(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get<User>(`/users/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email, role } = response.data;
        setFormData({ name, email, role });
      } catch {
        toast.error('❌ Failed to load user data');
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put<User>(`/users/update/${userId}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('✅ User updated successfully!');
      console.log(response.data);
    } catch {
      toast.error('❌ Error updating user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Update User</h2>

      {successMessage && (
        <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.name}
            onChange={handleChange}
            title='User name'
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
            title='User email'
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Role</label>
          <select
            name="role"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.role}
            onChange={handleChange}
            title='User role'
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update User'}
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;
