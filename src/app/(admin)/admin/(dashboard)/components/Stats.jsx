'use client';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingOverlay from './LoadingOverlay';

const userData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 500 },
  { name: 'Apr', users: 200 },
  { name: 'May', users: 400 },
  { name: 'Jun', users: 300 },
  { name: 'Jul', users: 500 },
];

const bookingData = [
  { name: 'Jan', bookings: 200 },
  { name: 'Feb', bookings: 400 },
  { name: 'Mar', bookings: 300 },
  { name: 'Apr', bookings: 400 },
  { name: 'May', bookings: 200 },
  { name: 'Jun', bookings: 400 },
  { name: 'Jul', bookings: 300 },
];

function Stats() {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false)
  }, 2000);
  return (
    <div className="stats">
    <h2>Statistics</h2>
    <div className="stats-graphs">
      <div className="stats-graph" style={{ position: 'relative' }}>
        <h3>Monthly Users</h3>
        {loading && <LoadingOverlay />}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip/>
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="stats-graph" style={{ position: 'relative' }}>
        <h3>Monthly Bookings</h3>
        {loading && <LoadingOverlay />}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip  />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  );
}

export default Stats;
