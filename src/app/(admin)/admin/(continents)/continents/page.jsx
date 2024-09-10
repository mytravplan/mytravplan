// /app/(admin)/admin/(continents)/continent/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function ContinentPage() {
  const [continents, setContinents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  async function fetchContinents() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/continents/get?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      if (data.success) {
        setContinents(data.result);
        setTotalResults(data.totalResults); // Set totalResults from API
      } else {
        toast.error(data.message || 'An error occurred');
      }
      setLoading(false);
    })



  }

  useEffect(() => {
    fetchContinents();
  }, [currentPage]);

  const handleAddClick = () => {
    router.push('/admin/continents/add-continent');
  };

  const handleConfirm = async () => {

    return handelAsyncErrors(async () => {
      // Add similar checks for cities and admin-packages if necessary
      const response = await fetch(`/api/v1/continent/delete/${deleteItem}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchContinents();
        toast.success(data.message || 'Continent deleted successfully.');
        setIsOpen(false)
      } else {
        toast.error(data.message || 'An error occured');
      }
    })


  };

  const handleDelete = (id) => {
    setIsOpen(true)
    setDeleteItem(id)
  }

  const handleEdit = (id) => {
    router.push(`/admin/continents/update-continent/${id}`);
  };

  const handlePreview = (id) => {
    router.push(`/admin/continents/preview-continent/${id}`);
  };

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
        onConfirm={handleConfirm}
      />

      <div className="package_header">
        <Breadcrumb path="/admin/continents" />
        <div className="floating-plus" onClick={handleAddClick}>
          <FaPlus />
          <div className="add_tooltip">Add Continent</div>
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
              <th>Countries Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">Loading...</td>
              </tr>
            ) : continents.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Continents Available</td>
              </tr>
            ) : (
              continents.map(continent => (
                <tr key={continent._id}>
                  <td data-label="Image">
                    <img
                      src={`/uploads/${continent.images[0].name}`}
                      alt={continent.title}
                      className="package-image"
                    />
                  </td>
                  <td data-label="ID">{continent._id}</td>
                  <td data-label="Title">{continent.title}</td>
                  <td data-label="Description">{continent.description}</td>
                  <td data-label="Countries Count">{continent.countries ? continent.countries.length : 0}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaEye className="action-icon view" title="View" onClick={() => handlePreview(continent._id)} />
                      <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(continent._id)} />
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(continent._id)} />
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

export default ContinentPage;
