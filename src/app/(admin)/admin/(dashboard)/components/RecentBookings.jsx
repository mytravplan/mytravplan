'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

function RecentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      return handelAsyncErrors(async () => {
        const response = await fetch('/api/v1/bookings/get');
        const data = await response.json();
        if (data.status === 200) {
          // Sort bookings by date in descending order
          const sortedBookings = data.result.sort((a, b) => new Date(b.date) - new Date(a.date));
          // Show only the first 4 most recent bookings
          setBookings(sortedBookings.slice(0, 4));
        } else {
          console.error('Failed to fetch bookings:', data.message);
        }
        setLoading(false);
      })


    };

    fetchBookings();
  }, []);

  return (
    <div className="recent-bookings">
      <h2>Recent Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className='loading'>Loading...</td>
            </tr>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => {
              const formattedDate = format(new Date(booking.createdAt), 'dd MMM yyyy');
              return (
                <>
                  <tr key={booking._id}>
                    <td>{booking._id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone_number}</td>
                    <td>{formattedDate}</td>
                  </tr>
                </>
              )
            })
          ) : (
            <tr>
              <td colSpan="9">No recent bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='view_recent_bookings'>
        <button onClick={() => router.push('/admin/bookings')}>
          <FaEye /> View All
        </button>
      </div>
    </div>
  );
}

export default RecentBookings;
