
// /app/(admin)/admin/(activities)/activities/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import {  toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';


function ActivityPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
    const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
  
    async function fetchActivities() {
      try {
        const response = await fetch(`/api/v1/activities/get?page=${currentPage}&limit=${itemsPerPage}`);
        const data = await response.json();
        if (data.success) {
            setActivities(data.result);
          setTotalResults(data.totalResults); // Set totalResults from API
        } else {
          toast.error(data.message || 'Failed to fetch Activity.');
        }
      } catch (error) {
        toast.error('Error fetching Activity.');
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      fetchActivities();
    }, [currentPage]);
  
    const handleAddClick = () => {
      router.push('/admin/activities/add-activity');
    };
  
    const handleConfirm = async () => {
      
        try {
          const response = await fetch(`/api/v1/activity/delete/${deleteItem}`, { method: 'DELETE' });
          const data = await response.json();
          if (data.success) {
            fetchActivities();
            toast.success(data.message || 'Activity deleted successfully.');
            setIsOpen(false)
          } else {
            toast.error(data.message ||'Failed to delete Activity.');
          }
        } catch (error) {
          toast.error('Failed to delete Activity, please try again.');
        }
      
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
  
    const handleEdit = (id) => {
      router.push(`/admin/activities/update-activity/${id}`);
    };
  
    const handlePreview = (id) => {
      router.push(`/admin/activities/preview-activity/${id}`);
    };
  
    return (
      <div className="admin-packages">
        <ModalWrapper
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        onConfirm={handleConfirm}
        />
        <div className="package_header">
        <Breadcrumb path="/admin/activities" />
        <div className="floating-plus" onClick={handleAddClick}>
          <FaPlus />
          <div className="add_tooltip">Add Activity</div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading">Loading...</td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No activities Available</td>
                </tr>
              ): (
                activities.map(Activity => (
                  <tr key={Activity._id}>
                    <td data-label="Image">
                      <img 
                        src={`/uploads/${Activity.images[0].name}`} 
                        alt={Activity.title} 
                        className="package-image" 
                      />
                    </td>
                    <td data-label="ID">{Activity._id}</td>
                    <td data-label="Title">{Activity.title}</td>
                    <td data-label="Description">{Activity.description}</td>
                    <td data-label="Actions">
                      <span className="actions">
                        <FaEye className="action-icon view" title="View" onClick={() => handlePreview(Activity._id)} />
                        <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(Activity._id)} />
                        <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(Activity._id)} />
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
  )
}

export default ActivityPage