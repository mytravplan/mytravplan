'use client';
import React, { useState, useRef } from 'react';
import { FaMinus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

const CreateTransfer = () => {
  const router = useRouter();
  const slugInputRef = useRef(null);
  const [formData, setFormData] = useState({
    transfer_title: '',
    transfer_slug: '',
    transfer_price: '',
    transfer_overview_description: '',
    transfer_image: null,
    transfer_galleries: [],
    seo_title: '',
    seo_description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')     // Spaces to -
      .replace(/[^\w-]+/g, '')  // Remove non-word chars
      .replace(/--+/g, '-')     // Replace multiple - with single
      .replace(/^-+/, '')       // Trim - from start
      .replace(/-+$/, '');      // Trim - from end
  };

  // Auto-fill slug when slug field is focused
  const handleSlugFocus = () => {
    if (!formData.transfer_slug && formData.transfer_title) {
      setFormData(prev => ({
        ...prev,
        transfer_slug: generateSlug(prev.transfer_title)
      }));
    }
  };

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'transfer_image' && files) {
      setFormData(prev => ({
        ...prev,
        transfer_image: files[0],
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle gallery files
  const handleGalleryChange = (e) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        transfer_galleries: Array.from(e.target.files),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      transfer_title,
      transfer_slug,
      transfer_price,
      transfer_overview_description,
      transfer_image,
      transfer_galleries,
      seo_title,
      seo_description,
    } = formData;

    if (!transfer_title || !transfer_slug || !transfer_price || !transfer_image) {
      toast.error('Please fill required fields: Title, Slug, Price, and Main Image');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('transfer_title', transfer_title);
      submissionData.append('transfer_slug', transfer_slug);
      submissionData.append('transfer_price', transfer_price);
      submissionData.append('transfer_overview_description', transfer_overview_description);
      submissionData.append('transfer_image', transfer_image);

      transfer_galleries.forEach(file => {
        submissionData.append('transfer_galleries', file);
      });

      if (seo_title) submissionData.append('seo_title', seo_title);
      if (seo_description) submissionData.append('seo_description', seo_description);

      const res = await fetch('/api/v1/transfer/create', {
        method: 'POST',
        body: submissionData,
      });
      const data = await res.json();

      if (data.status===201) {
        toast.success(data.message || 'Transfer created successfully!');
        router.push('/admin/transfer');
      } else {
        toast.error(data.message || 'Failed to create transfer');
      }
      setIsLoading(false);
    });
  };

  return (
    <>
      <h2>Create Transfer</h2>
      <div className="transfer_form_wrapper">
        <div className="add_transfer">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="transfer_title">Title *</label>
              <input
                type="text"
                id="transfer_title"
                name="transfer_title"
                value={formData.transfer_title}
                onChange={handleChange}
                placeholder="Enter transfer title"
                required
              />
            </div>

            {/* Slug - Auto-fills when focused */}
            <div className="form-group">
              <label htmlFor="transfer_slug">Slug *</label>
              <input
                type="text"
                id="transfer_slug"
                name="transfer_slug"
                ref={slugInputRef}
                value={formData.transfer_slug}
                onChange={handleChange}
                onFocus={handleSlugFocus}
                placeholder="Click to generate from title"
                required
              />
            </div>

            {/* Price - Changed to number input */}
            <div className="form-group">
              <label htmlFor="transfer_price">Price (₹) *</label>
              <input
                type="number"
                id="transfer_price"
                name="transfer_price"
                value={formData.transfer_price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Rest of your form remains the same */}
            {/* Overview Description */}
            <div className="form-group">
              <label htmlFor="transfer_overview_description">Overview Description</label>
              <textarea
                id="transfer_overview_description"
                name="transfer_overview_description"
                value={formData.transfer_overview_description}
                onChange={handleChange}
                placeholder="Short overview of this transfer"
              />
            </div>

            {/* Main Image */}
            <div className="form-group">
              <label htmlFor="transfer_image">Main Image *</label>
              <input
                type="file"
                id="transfer_image"
                name="transfer_image"
                accept="image/*"
                onChange={handleChange}
                required
              />
              {formData.transfer_image && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(formData.transfer_image)}
                    alt="Main Preview"
                    style={{ maxWidth: '200px', marginTop: '0.5rem' }}
                  />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="form-group">
              <label htmlFor="transfer_galleries">Gallery Images</label>
              <input
                type="file"
                id="transfer_galleries"
                name="transfer_galleries"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
              />
              {formData.transfer_galleries.length > 0 && (
                <div className="gallery-preview" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {formData.transfer_galleries.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Gallery ${index + 1}`}
                      style={{ maxWidth: '120px', maxHeight: '80px' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SEO Fields */}
            <div className="sco_panel">
              <h3>SEO Meta</h3>
              <div className="form-group">
                <label htmlFor="seo_title">SEO Title</label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  placeholder="Enter SEO title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="seo_description">SEO Description</label>
                <input
                  type="text"
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  placeholder="Enter SEO description"
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Transfer'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTransfer;