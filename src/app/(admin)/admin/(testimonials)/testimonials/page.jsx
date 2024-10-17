// /app/(admin)/admin/(testimonials)/testimonials/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);


  console.log(`testimonials`)
  console.log(testimonials)

  async function fetchTestimonials() {
    try {
      const response = await fetch(`/api/v1/testimonials/get?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      if (data) {
        setTestimonials(data.result);
        setTotalResults(data.totalResults);  
      } else {
        toast.error(data.message || 'Failed to fetch testimonials.');
      }
    } catch (error) {
      toast.error('Error fetching testimonials.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage]);

  const handleAddClick = () => {
    router.push('/admin/testimonials/add-testimonial'); // Adjust this path as necessary
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(`/api/v1/testimonial/delete/${deleteItem}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchTestimonials();
        toast.success(data.message || 'Testimonial deleted successfully.');
        setIsOpen(false);
      } else {
        toast.error(data.message || 'Failed to delete testimonial.');
      }
    } catch (error) {
      toast.error('Failed to delete testimonial, please try again.');
    }
  };

  const handleDelete = (id) => {
    setIsOpen(true);
    setDeleteItem(id);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/testimonials/update-testimonial/${id}`); // Adjust this path as necessary
  };

  const handlePreview = (id) => {
    router.push(`/admin/testimonials/preview-testimonial/${id}`); // Adjust this path as necessary
  };

  return (
    <div className="admin-testimonials">
      <ModalWrapper
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
      <div className="testimonials_header">
        <Breadcrumb path="/admin/testimonials" />
        <div className="floating-plus" onClick={handleAddClick}>
          <FaPlus />
          <div className="add_tooltip">Add Testimonial</div>
        </div>
      </div>
      <div className="admin-testimonials-table-container">
        <table className="admin-testimonials-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">Loading...</td>
              </tr>
            ) : testimonials===undefined? (
              <tr>
                <td colSpan="6" className="no-data">No Testimonials Available</td>
              </tr>
            ) : (
              testimonials.map(testimonial => (
                <tr key={testimonial._id}>
                  <td data-label="Image">
                    <img
                      src={`/uploads/${testimonial.file?.name}`}
                      alt={testimonial.name}
                      className="testimonial-image"
                    />
                  </td>
                  <td data-label="ID">{testimonial._id}</td>
                  <td data-label="Name">{testimonial.name}</td>
                  <td data-label="Description">{testimonial.description}</td>
                  <td data-label="Designation">{testimonial.designation}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaEye className="action-icon view" title="View" onClick={() => handlePreview(testimonial._id)} />
                      <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(testimonial._id)} />
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(testimonial._id)} />
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
        <span className="pagination-info">Page {currentPage} of {Number(totalPages)}</span>
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

export default Testimonials;
