
// // /app/(admin)/admin/(countries)/countries/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';



function CountryPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
  const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  async function fetchCountries() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/countries/get?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      if (data.success) {
        setCountries(data.result);
        setTotalResults(data.totalResults); // Set totalResults from API
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchCountries();
  }, [currentPage, itemsPerPage]);

  const handleAddClick = () => {
    router.push('/admin/countries/add-country');
  };

  const handleConfirm = async () => {
 
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/country/delete/${deleteItem}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchCountries();
        toast.success(data.message || 'Country deleted successfully');
        setIsOpen(false)
      } else {
        toast.error(data.message || 'Failed to delete country');
      }
    })
       
  };

  const  handleDelete=(id)=>{
    setIsOpen(true)
    setDeleteItem(id)
  }
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/countries/update-country/${id}`);
  };

  const handlePreview = (id) => {
    router.push(`/admin/countries/preview-country/${id}`);
  };

  return (
    <div className="admin-packages">
      <ModalWrapper
      isOpen={isOpen}
      onClose={()=>setIsOpen(false)}
      onConfirm={handleConfirm}
      />
      <div className="package_header">
      <Breadcrumb path="/admin/countries"/>
      <div className="floating-plus" onClick={handleAddClick}>
        <FaPlus />
        <div className="add_tooltip">Add Country</div>
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
              <th>Cities Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">Loading...</td>
              </tr>
            ) : countries.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Countries Available</td>
              </tr>
            ) : (
              countries.map(country => (
                <tr key={country._id}>
                  <td data-label="Image">
                    <img 
                      src={`/uploads/${country.images[0].name}`} 
                      alt={country.title} 
                      className="package-image" 
                    />
                  </td>
                  <td data-label="ID">{country._id}</td>
                  <td data-label="Title">{country.title}</td>
                  <td data-label="Description">{country.description}</td>
                  <td data-label="Cities Count">{country.cities ? country.cities.length : 0}</td>
                  <td data-label="Actions">
                    <span className="actions">
                      <FaEye className="action-icon view" title="View" onClick={() => handlePreview(country._id)} />
                      <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(country._id)} />
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(country._id)} />
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

export default CountryPage;

