'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';

function UpdateTransfer({ params }) {
  const [formData, setFormData] = useState({
    transfer_title: '',
    transfer_slug: '',
    transfer_price: '',
    transfer_overview_description: '',
    transfer_image: null,
    transfer_image_preview: '',
    transfer_galleries: [],         // existing filenames only
    transfer_gallery_files: [],     // newly chosen File objects
    transfer_gallery_previews: [],  // previews for newly chosen files
    seo_title: '',
    seo_description: '',
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = params;

  // Remove main image (existing or newly selected)
  const removeMainImage = () => {
    setFormData(prev => ({
      ...prev,
      transfer_image: null,
      transfer_image_preview: '',
    }));
  };

  // Remove an existing gallery image by index
  const removeExistingGallery = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      transfer_galleries: prev.transfer_galleries.filter((_, i) => i !== indexToRemove)
    }));
  };

  // Remove a newly added gallery file by index
  const removeNewGalleryFile = (indexToRemove) => {
    setFormData(prev => {
      const newFiles = prev.transfer_gallery_files.filter((_, i) => i !== indexToRemove);
      const newPreviews = prev.transfer_gallery_previews.filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        transfer_gallery_files: newFiles,
        transfer_gallery_previews: newPreviews,
      };
    });
  };

  useEffect(() => {
    const fetchTransfer = async () => {
      return handelAsyncErrors(async () => {
        const response = await fetch(`/api/v1/transfer/get/${id}`);
        const data = await response.json();
        if (data.result) {
          setFormData({
            transfer_title: data.result.transfer_title,
            transfer_slug: data.result.transfer_slug,
            transfer_price: data.result.transfer_price,
            transfer_overview_description: data.result.transfer_overview_description || '',
            transfer_image: data.result.transfer_image,
            transfer_image_preview: data.result.transfer_image
              ? data.result.transfer_image
              : '',
            transfer_galleries: data.result.transfer_galleries || [],

            // IMPORTANT: leave "transfer_gallery_previews" empty on load
            transfer_gallery_files: [],
            transfer_gallery_previews: [],

            seo_title: data.result.seo_title || '',
            seo_description: data.result.seo_description || '',
          });
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      });
    };

    fetchTransfer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'transfer_image') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            transfer_image: file,
            transfer_image_preview: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    }
    else if (name === 'transfer_gallery_files') {
      const galleryFiles = Array.from(files);
      const galleryPreviews = galleryFiles.map(file => URL.createObjectURL(file));

      setFormData(prev => ({
        ...prev,
        transfer_gallery_files: galleryFiles,
        transfer_gallery_previews: galleryPreviews,
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('transfer_title', formData.transfer_title);
    formDataToSend.append('transfer_slug', formData.transfer_slug);
    formDataToSend.append('transfer_price', formData.transfer_price);
    formDataToSend.append('transfer_overview_description', formData.transfer_overview_description);

    // If a new File object was selected, send it;
    // if the field is now null (meaning user removed it), signal deletion
    if (formData.transfer_image instanceof File) {
      formDataToSend.append('transfer_image', formData.transfer_image);
    } else if (formData.transfer_image === null) {
      formDataToSend.append('delete_main_image', 'true');
    }

    // Send existing gallery filenames that remain
    formData.transfer_galleries.forEach(filename => {
      formDataToSend.append('existing_galleries', filename);
    });
    // Send newly chosen files
    formData.transfer_gallery_files.forEach(file => {
      formDataToSend.append('transfer_galleries', file);
    });

    if (formData.seo_title) {
      formDataToSend.append('seo_title', formData.seo_title);
    }
    if (formData.seo_description) {
      formDataToSend.append('seo_description', formData.seo_description);
    }

    try {
      const response = await fetch(`/api/v1/transfer/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      const data = await response.json();

      if (data.success === true) {
        toast.success(data.message || 'Updated successfully');
        setTimeout(() => router.push('/admin/transfer'), 2000);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('An error occurred while updating the transfer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-transfer-container">
      <h2>Update Transfer</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="transfer_title"
            value={formData.transfer_title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Slug */}
        <div className="form-group">
          <label>Slug *</label>
          <input
            type="text"
            name="transfer_slug"
            value={formData.transfer_slug}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price (₹) *</label>
          <input
            type="number"
            name="transfer_price"
            value={formData.transfer_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Overview Description */}
        <div className="form-group">
          <label>Overview Description</label>
          <textarea
            name="transfer_overview_description"
            value={formData.transfer_overview_description}
            onChange={handleChange}
          />
        </div>

        {/* Main Image */}
        <div className="form-group">
          <label>Main Image</label>
          {formData.transfer_image_preview && (
            <div className="existing-image-wrapper">
              <img
                src={formData.transfer_image_preview}
                alt="Transfer Preview"
                className="preview-image"
              />
              <button
                type="button"
                className="delete-button"
                onClick={removeMainImage}
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
          <input
            type="file"
            name="transfer_image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

      
        <div className="form-group">
          <label>Gallery Images</label>
          <div className="gallery-wrapper">
     
            {formData.transfer_galleries.map((file, idx) => (
              <div key={`existing-${idx}`} className="gallery-image-wrapper">
                <img
                  src={file}
                  alt={`Gallery ${idx + 1}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeExistingGallery(idx)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}

           
            {formData.transfer_gallery_previews.map((preview, idx) => (
              <div key={`new-${idx}`} className="gallery-image-wrapper">
                <img
                  src={preview}
                  alt={`New Gallery ${idx + 1}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeNewGalleryFile(idx)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            name="transfer_gallery_files"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
        </div>

        {/* SEO Fields */}
        <div className="sco_panel">
          <h3>SEO Meta</h3>
          <div className="form-group">
            <label>SEO Title</label>
            <input
              type="text"
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>SEO Description</label>
            <input
              type="text"
              name="seo_description"
              value={formData.seo_description}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Transfer'}
        </button>
      </form>
    </div>
  );
}

export default UpdateTransfer;
