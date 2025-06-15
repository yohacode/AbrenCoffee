import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserEngagementChart:React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserEngagement = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const res = await axios.get('/adminPanel/user-engagement/', config);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching user engagement:', err);
      }
      setLoading(false);
    };

    fetchUserEngagement();
  }, []);

  if (loading) return <div>Loading user engagement...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="visits" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserEngagementChart;
