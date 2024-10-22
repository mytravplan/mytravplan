'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

const AddTestimonialVideo = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    video: null, // Changed to 'video'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes, including video file upload
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'video') { // Changed 'videoFile' to 'video'
      setFormData((prevData) => ({
        ...prevData,
        video: files[0], // Store the first video file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Function to log form data (for debugging purposes)
  const logFormData = (formData) => {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    const { name, description, video } = formData;

    // Check if any fields are provided
    if (!name || !description || !video) {
      toast.error('Please provide all required fields.');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('name', name);
      submissionData.append('description', description);
      submissionData.append('video', video);  // Key is 'video' now


      console.log(`submissionData`)
      console.log(submissionData)

      // Log the FormData for debugging
      logFormData(submissionData);

      // Send a POST request to the server with the form data
      const res = await fetch('/api/v1/video/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      // Handle response based on success or failure
      if (data.success) {
        toast.success(data.message || 'Testimonial video added successfully!');
        router.push('/admin/testimonial-videos');  
      } else {
        toast.error(data.message || 'Failed to add testimonial video.');
      }
      setIsLoading(false);  
    });
  };

  return (
    <div className="add-testimonial-video-container">
      <h2>Add Testimonial Video</h2>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="video">Video</label>  
          <input
            type="file"
            id="video"
            name="video"  
            onChange={handleChange}
            accept="video/*"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Testimonial Video'}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonialVideo;
