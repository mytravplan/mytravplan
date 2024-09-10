// /app/(admin)/admin/(bookings)/bookings/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { format } from 'date-fns';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';


function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);


  async function fetchBookings() {
    
      const response = await fetch(`/api/v1/bookings/get?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      return handelAsyncErrors(async()=>{
        if (response.ok && data.status === 200) {
          setBookings(data.result);
          setTotalResults(data.totalResults); // Set totalResults from API
        } else {
          setError('Failed to fetch bookings');
        }
        setLoading(false);
      })
      
    
  }

  useEffect(() => {
    fetchBookings();
  }, [currentPage, itemsPerPage]);

  const confirmDelete = async () => {
        const response = await fetch(`/api/v1/booking/delete/${deleteItem}`, { method: 'DELETE' });
        const data = await response.json();
        return handelAsyncErrors(async()=>{
          if (response.ok && data.status === 200) {
            fetchBookings();
            toast.success(data.message || 'booking query deleted successfully');
            setIsOpen(false)
          } else {
            toast.error(data.message || 'Failed to delete booking query');
          }
        })
  };

  const handleDelete = (id) => {
    setIsOpen(true)
    setDeleteItem(id)
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-packages">
      <ModalWrapper
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirmDelete}
      />
      <Breadcrumb path="/admin/bookings" />
      {error && <div className="error">{error}</div>}
      <div className="admin-packages-table-container">
        <table className="admin-packages-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="loading">Loading...</td>
              </tr>
            ): bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Bookings Available</td>
              </tr>
            ) : (
              bookings.map(booking =>{
                const formattedDate = format(new Date(booking.createdAt), 'dd MMM yyyy');
                return(
                  <>
                  <tr key={booking._id}>
                  <td data-label="Booking ID">{booking._id}</td>
                  <td data-label="Name">{booking.name}</td>
                  <td data-label="Email">{booking.email}</td>
                  <td data-label="Phone Number">{booking.phone_number}</td>
                  <td data-label="Date">{formattedDate}</td>
                  <td data-label="Message">{booking.message}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaTrashAlt
                        className="action-icon delete"
                        title="Delete"
                        onClick={() => handleDelete(booking._id)}
                      />
                    </span>
                  </td>
                </tr>
                  </>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          {'<<'}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          {'<'}
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          {'>'}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;

