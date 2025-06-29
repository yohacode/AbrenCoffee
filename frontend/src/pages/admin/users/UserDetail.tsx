import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './userDetail.css';
import axios from '../../../utils/axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profile_image: string;
  isActive: boolean;
  date_joined: string;
}

const UserDetail:React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit mode state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`/users/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 200) throw new Error('User not found');
        setUser(response.data);
      } catch {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const startEditing = (field: keyof User) => {
    if (!user) return;
    setEditingField(field);
    setEditedValue(String(user[field]));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditedValue('');
  };

  const saveEdit = async () => {
    if (!user || !editingField) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.patch(
        `/users/update/${user.id}/`,
        { [editingField]: editedValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setEditingField(null);
      setEditedValue('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert('Update failed: ' + err.message);
      } else {
        alert('Update failed: An unknown error occurred');
      }
    }
  };

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div className="user-detail">
      <h2>User Detail</h2>
      <div className="detail-card">
        <img src={user.profile_image} alt="" />
        <div className="user-detail-info">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>

          {/* Profile Image */}
          <p>
            <strong>Image:</strong>{' '}
            {editingField === 'image' ? (
              <>
                <input
                  title='image'
                  type="file"
                  accept="image/*"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                {user.profile_image}
                <button onClick={() => startEditing('profile_image')}>Edit</button>
              </>
            )}
          </p>

          {/* Email */}
          <p>
            <strong>Email:</strong>{' '}
            {editingField === 'email' ? (
              <>
                <input
                  title='email'
                  type="email"
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                {user.email}
                <button onClick={() => startEditing('email')}>Edit</button>
              </>
            )}
          </p>

          {/* Role */}
          <p>
            <strong>Role:</strong>{' '}
            {editingField === 'role' ? (
              <>
                <select
                  title='role'
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">customer</option>
                  <option value="user">User</option>
                </select>
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                {user.role}
                <button onClick={() => startEditing('role')}>Edit</button>
              </>
            )}
          </p>

          <p><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</p>
          <p><strong>Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
