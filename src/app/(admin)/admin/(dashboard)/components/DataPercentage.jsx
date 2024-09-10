
// components/DataPercentage.jsx

'use client';

import { handelAsyncErrors } from '@/helpers/asyncErrors';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const DataPercentage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from APIs
  const fetchData = async () => {
    return handelAsyncErrors(async () => {
      const endpoints = [
        '/api/v1/continents/get',
        '/api/v1/countries/get',
        '/api/v1/cities/get',
        '/api/v1/packages/get',
      ];

      const results = await Promise.all(endpoints.map(async (endpoint) => {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }));

      // Update data state
      setData([
        { label: 'Continents', value: results[0].totalResults, color: '#FF6384' },
        { label: 'Countries', value: results[1].totalResults, color: '#36A2EB' },
        { label: 'Cities', value: results[2].totalResults, color: '#FFCE56' },
        { label: 'Packages', value: results[3].totalResults, color: '#4BC0C0' },
      ]);

      setLoading(false);
    })
      
    
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Refresh every 60 seconds
    return () => clearInterval(intervalId);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="pie-chart">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
              const radius = outerRadius - 10;
              const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
              const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
              return (
                <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                  {((value / total) * 100).toFixed(2)}%
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { name, value } = payload[0];
                const percentage = ((value / total) * 100).toFixed(2);
                return (
                  <div className="tooltip">
                    <strong>{name}</strong>: {percentage}%
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      )}
    </div>
  );
};

export default DataPercentage;
