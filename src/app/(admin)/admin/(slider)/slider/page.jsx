'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';

function SliderManagement() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [sliderFormData, setSliderFormData] = useState({
    galleries: []
  });
  const router = useRouter();

  // Fetch all sliders
  async function fetchSliders() {
    try {
      const response = await fetch('/api/v1/sliders/get');
      const data = await response.json();
      if (data.success) {
        setSliders(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch sliders.');
      }
    } catch (error) {
      toast.error('Error fetching sliders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleAddClick = () => {
    setSelectedSlider(null);
    setSliderFormData({ galleries: [] }); // Reset form
    router.push('/admin/slider/add-slider'); // Redirect to add slider page
  };

  const handleEdit = (slider) => {
    setSelectedSlider(slider);
    setSliderFormData({ galleries: slider.galleries }); 
    router.push(`/admin/slider/update-slider/${slider._id}`); // Pre-fill the form
  };

  const handleShow = (slider) => {
    setSelectedSlider(slider);
    router.push(`/admin/slider/slider-preview/${slider._id}`); // Show slider preview
  };

  const handleDelete = (id) => {
    setIsOpen(true);
    setDeleteItem(id);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/v1/slider/delete/${deleteItem}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchSliders();
        toast.success(data.message || 'Slider deleted successfully.');
        setIsOpen(false);
      } else {
        toast.error(data.message || 'Failed to delete slider.');
      }
    } catch (error) {
      toast.error('Failed to delete slider, please try again.');
    }
  };

  const deleteSinlgeImage=async(imageId)=>{
    let resp=await fetch(`/api/v1/sliders/delete/${imageId}`,{method:'DELETE'})
    let data=await resp.json()
    if(data){
        toast.success('image deleted succesfully')
        fetchSliders()
    }
  }

  

  return (
    <div className="slider-management">
      <ModalWrapper
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <div className="slider-header">
        <Breadcrumb path="/admin/sliders" />
        <div className="floating-plus" onClick={handleAddClick}>
          <FaPlus />
          <div className="add_tooltip">Add Slider</div>
        </div>
      </div>
      <div className="admin-slider-table-container">
        <table className="admin-slider-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="loading">Loading...</td>
              </tr>
            ) : sliders.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">No Sliders Available</td>
              </tr>
            ) : (
              sliders.map(slider => (
                <tr key={slider._id}>
                  <td>
                    {slider?.galleries.length > 0 || slider?.galleries===undefined? (
                      slider.galleries.map((image) => (
                        <>
                        
                        <img
                          src={`/uploads/${image.name}`}
                          alt="Slider Image"
                          className="slider-image"
                          width={100}
                          key={image._id}
                        />
                        <button onClick={()=>deleteSinlgeImage(image._id)}>X</button>
                        </>
                      ))
                    ) : (
                      <span>No Images Available</span>
                    )}
                  </td>
                  <td>{slider._id}</td>
                  <td>
                    <span className="actions">
                      <FaEye className="action-icon view" title="View" onClick={() => handleShow(slider._id)} />
                      <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(slider)} />
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(slider._id)} />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SliderManagement;
