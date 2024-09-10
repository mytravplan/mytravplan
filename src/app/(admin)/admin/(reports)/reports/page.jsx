'use client';
import React, { useState, useEffect } from 'react';
import { userActivityData, financialData, salesData, feedbackData } from '../components/mockData';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';

function ReportsPage() {
  const [reports, setReports] = useState({
    userActivity: [],
    financial: [],
    sales: [],
    feedback: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchReports = async () => {
      return handelAsyncErrors(async () => {
        // Simulate a delay for fetching data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setReports({
          userActivity: userActivityData,
          financial: financialData,
          sales: salesData,
          feedback: feedbackData,
        });
        setLoading(false);
      })


    };

    fetchReports();
  }, []);

  return (
    <div className="reports-page">
      <Breadcrumb path="/admin/reports"/>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <section>
            <h2>User Activity</h2>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Logins</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {reports.userActivity.map((item) => (
                  <tr key={item.user}>
                    <td>{item.user}</td>
                    <td>{item.logins}</td>
                    <td>{item.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2>Financial Report</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue</th>
                  <th>Expenses</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {reports.financial.map((item) => (
                  <tr key={item.month}>
                    <td>{item.month}</td>
                    <td>${item.revenue}</td>
                    <td>${item.expenses}</td>
                    <td>${item.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2>Sales Report</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reports.sales.map((item) => (
                  <tr key={item.product}>
                    <td>{item.product}</td>
                    <td>{item.sales}</td>
                    <td>${item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2>Customer Feedback</h2>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {reports.feedback.map((item) => (
                  <tr key={item.user}>
                    <td>{item.user}</td>
                    <td>{item.rating}</td>
                    <td>{item.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
