
// // // /app/(admin)/admin/(cities)/cities/page.jsx


'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function CityPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);


  async function fetchCities() {

    const response = await fetch(`/api/v1/cities/get?page=${currentPage}&limit=${itemsPerPage}`);
    const data = await response.json();
    return handelAsyncErrors(async () => {
      if (data.success) {
        setCities(data.result);
        setTotalResults(data.totalResults); // Set totalResults from API
      }
      else {
        toast.error(data.message || 'An error occurred')
      }
      setLoading(false);
    })


  }

  useEffect(() => {
    fetchCities();
  }, [currentPage]);

  const handleAddClick = () => {
    router.push('/admin/cities/add-city');
  };

  const confirmDelete = async () => {

    const response = await fetch(`/api/v1/city/delete/${deleteItem}`, { method: 'DELETE' });
    return handelAsyncErrors(async () => {
      if (response.ok) {
        fetchCities();
        toast.success(response.message || 'City deleted successfully');
        setIsOpen(false)
      } else {
        toast.error(response.message || 'Failed to delete city, please try again.');
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

  const handleEdit = (id) => {
    router.push(`/admin/cities/update-city/${id}`);
  };

  const handlePreview = (id) => {
    router.push(`/admin/cities/preview-city/${id}`);
  };

  return (
    <div className="admin-packages">
      <ModalWrapper
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={confirmDelete}
      />
      <div className="package_header">
        <Breadcrumb path="/admin/cities" />
        <div className="floating-plus" onClick={handleAddClick}>
          <FaPlus />
          <div className="add_tooltip">Add City</div>
        </div>
      </div>

      <div className="admin-packages-table-container">
        <table className="admin-packages-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Package Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">Loading...</td>
              </tr>
            ) : cities.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Cities Available</td>
              </tr>
            ) : (
              cities.map(city => (
                <tr key={city._id}>
                  <td data-label="Image">
                    <img
                      src={`/uploads/${city.images[0].name}`}
                      alt={city.title}
                      className="package-image"
                    />
                  </td>
                  <td data-label="ID">{city._id}</td>
                  <td data-label="Title">{city.title}</td>
                  <td data-label="Description">{city.description}</td>
                  <td data-label="Package Count">{city.packagesCount ? city.packagesCount : 0}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaEye className="action-icon view" title="View" onClick={() => handlePreview(city._id)} />
                      <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(city._id)} />
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(city._id)} />
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

export default CityPage;
