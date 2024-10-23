'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const SliderAdd = () => {
  const [formData, setFormData] = useState({
    galleries: []
  });
  const router = useRouter();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ galleries: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formData.galleries.forEach((file) => {
      formDataObj.append('galleries', file);
    });

    try {
      const response = await fetch('/api/v1/slider/add', {
        method: 'POST',
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Slider added successfully.');
        router.push('/admin/slider'); // Redirect to the sliders list
      } else {
        toast.error(data.message || 'Failed to add slider.');
      }
    } catch (error) {
      toast.error('Error adding slider.');
    }
  };

  return (
    <div>
      <h2>Add Slider</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          multiple 
          onChange={handleFileChange} 
          required 
          accept="image/*" // Optional: to restrict to image files only
        />
        <button type="submit">Add Slider</button>
      </form>
      <div>
        <h3>Selected Images:</h3>
        <ul>
          {formData.galleries.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SliderAdd;
