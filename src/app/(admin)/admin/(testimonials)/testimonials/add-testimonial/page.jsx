'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

const AddTestimonial = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    description: '',
    file: null, 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        file: files[0], // Store only the first image
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const logFormData = (formData) => {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    const { name, designation, description, file } = formData;

    // Check if all fields are empty
    if (!name && !designation && !description && !file) {
      toast.error('Please provide at least one field to submit.');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      if (name) submissionData.append('name', name);
      if (designation) submissionData.append('designation', designation);
      if (description) submissionData.append('description', description);
      if (file) submissionData.append('file', file); 
      
      // Log the FormData contents
      logFormData(submissionData);

      const res = await fetch('/api/v1/testimonial/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Testimonial added successfully!');
        router.push('/admin/testimonials');
      } else {
        toast.error(data.message || 'Failed to add testimonial.'); // Updated error message
      }
      setIsLoading(false); // Reset loading state after submission
    });
  };

  return (
    <div className="add-testimonial-container">
      <h2>Add Testimonial</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter designation"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Image</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            accept="image/*"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Testimonial'}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonial;
