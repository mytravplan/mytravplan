// /app/(admin)/admin/(flights)/flights/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';


function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);


  async function fetchFlights() {
    
      const response = await fetch(`/api/v1/flight/queries/get?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      return handelAsyncErrors(async()=>{
        if (response.ok && data.status === 200) {
            setFlights(data.result);
          setTotalResults(data.totalResults); // Set totalResults from API
        } else {
          setError('Failed to fetch flights');
        }
        setLoading(false);
      })
      
    
  }

  useEffect(() => {
    fetchFlights();
  }, [currentPage, itemsPerPage]);

  const confirmDelete = async () => {
        const response = await fetch(`/api/v1/flight/query/delete/${deleteItem}`, { method: 'DELETE' });
        const data = await response.json();
        return handelAsyncErrors(async()=>{
          if (response.ok && data.status === 200 && data.success) {
            fetchFlights();
            toast.success(data.message);
            setIsOpen(false)
          } else {
            toast.error(data.message || 'Failed to delete flight Query');
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
      <Breadcrumb path="/admin/flights" />
      {error && <div className="error">{error}</div>}
      <div className="admin-packages-table-container">
        <table className="admin-packages-table">
          <thead>
            <tr>
              <th>flight ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Traveler</th>
              <th>Children</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="loading">Loading...</td>
              </tr>
            ): flights.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No flights Available</td>
              </tr>
            ) : (
                flights.map(flight => (
                <tr key={flight._id}>
                  <td data-label="flight ID">{flight._id}</td>
                  <td data-label="Name">{flight.name}</td>
                  <td data-label="Email">{flight.email}</td>
                  <td data-label="Phone Number">{flight.phone_number}</td>
                  <td data-label="Date">{flight.date}</td>
                  <td data-label="Origin">{flight.origin}</td>
                  <td data-label="Destination">{flight.destination}</td>
                  <td data-label="Traveler">{flight.traveler}</td>
                  <td data-label="Children">{flight.children}</td>
                  <td data-label="Message">{flight.message}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaTrashAlt
                        className="action-icon delete"
                        title="Delete"
                        onClick={() => handleDelete(flight._id)}
                      />
                    </span>
                  </td>
                </tr>
              ))
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

export default FlightsPage;

