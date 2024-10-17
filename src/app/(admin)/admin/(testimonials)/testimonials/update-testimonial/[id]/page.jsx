'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

const UpdateTestimonial = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '', // changed from message to description
    designation: '',  // changed from rating to designation
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTestimonialData = async () => {
    return handelAsyncErrors(async () => {
      try {
        const res = await fetch(`/api/v1/testimonial/get/${id}`);
        const data = await res.json();
        console.log(data);
        if (data.success) {
          setFormData(data.result);
        } else {
          toast.error(data.message || 'Failed to fetch testimonial data');
        }
      } catch (error) {
        toast.error('An error occurred while fetching testimonial data.');
      }
    });
  };

  useEffect(() => {
    if (id) {
      fetchTestimonialData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, description, designation, file } = formData;

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('name', name);
      submissionData.append('description', description); // changed from message to description
      submissionData.append('designation', designation); // changed from rating to designation
      if (file) {
        submissionData.append('file', file);
      }

      const res = await fetch(`/api/v1/testimonial/update/${id}`, {
        method: 'PUT',
        body: submissionData,
      });

      const data = await res.json();

      setIsLoading(false); // Move loading state here to reset after completion

      if (data.success) {
        toast.success(data.message || 'Testimonial updated successfully!');
        router.push('/admin/testimonials');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    });
  };

  console.log(`formData`);
  console.log(formData);

  return (
    <div className="update-testimonial-container">
      <h2>Update Testimonial</h2>
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Message</label>
          <textarea
            id="description" // changed from message to description
            name="description" // changed from message to description
            value={formData.description} // changed from message to description
            onChange={handleChange}
            placeholder="Enter message"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          <input
            type="text"
            id="designation"
            name="designation" // changed from rating to designation
            value={formData.designation} // changed from rating to designation
            onChange={handleChange}
            placeholder="Enter designation"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload Image (optional)</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Testimonial'}
        </button>
      </form>
    </div>
  );
};

export default UpdateTestimonial;
