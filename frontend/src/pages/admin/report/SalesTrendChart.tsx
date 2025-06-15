import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesTrendChartProps {
  range: string;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ range }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesTrend = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const res = await axios.get(`/adminPanel/sales-trend/?range=${range}`, config);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching sales trend:', err);
      }
      setLoading(false);
    };

    fetchSalesTrend();
  }, [range]); // refetch when range changes

  if (loading) return <div>Loading sales trend...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesTrendChart;
