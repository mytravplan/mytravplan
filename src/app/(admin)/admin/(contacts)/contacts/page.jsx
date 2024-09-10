// /app/(admin)/admin/(contacts)/contacts/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  async function fetchContacts() {
    const response = await fetch(`/api/v1/queries/get?page=${currentPage}&limit=${itemsPerPage}`);
    const data = await response.json();

    return handelAsyncErrors(async()=>{
      if (response.ok && data.status === 200) {
        setContacts(data.result);
        setTotalResults(data.totalResults); // Set totalResults from API
      } else {
        toast.error(data.message || 'Failed to fetch Contacts');
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchContacts();
  }, [currentPage, itemsPerPage]);

  const handleConfirm = async () => {
        const response = await fetch(`/api/v1/query/delete/${deleteItem}`, { method: 'DELETE' });
        const data = await response.json();
        console.log('API Response:', data);
        return handelAsyncErrors(async()=>{
          if (response.ok && data.status === 200 ) {
            fetchContacts();
            toast.success(data.message || 'contact deleted successfully');
            setIsOpen(false)
          } else {
            toast.error(data.message || 'Failed to delete contact');
          }
        })
  };

  const handleDelete=(id)=>{
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
      onClose={()=>setIsOpen(false)}
      onConfirm={handleConfirm}
      />
      <Breadcrumb path="/admin/contatcs" />
      {error && <div className="error">{error}</div>}
      <div className="admin-packages-table-container">
        <table className="admin-packages-table">
          <thead>
            <tr>
              <th>Contact ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading">Loading...</td>
              </tr>
            ): contacts.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Contacts Available</td>
              </tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact._id}>
                  <td data-label="ID">{contact._id}</td>
                  <td data-label="Name">{contact.name}</td>
                  <td data-label="Email">{contact.email}</td>
                  <td data-label="Phone Number">{contact.phone_number}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(contact._id)} />
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

export default ContactsPage;
