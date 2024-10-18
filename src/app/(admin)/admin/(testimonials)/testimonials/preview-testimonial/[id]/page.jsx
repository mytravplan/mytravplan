'use client';
import React, { useEffect, useState } from 'react';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

function PreviewTestimonial({ params }) {
  const { id } = params;
  const [testimonial, setTestimonial] = useState({
    name: '',
    description: '',
    designation: '',
    file: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchTestimonial() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/testimonial/get/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setTestimonial(data.result); // Set the testimonial data
      } else {
        setError(data.message || 'Testimonial not found');
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchTestimonial();
  }, [id]);

  return (
    <div className="preview-testimonial-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>Name:</strong> {testimonial.name}</h2>
          <h3><strong>Designation:</strong> {testimonial.designation}</h3>
          <div className="testimonial_image">
            {testimonial.file ? (
              <img
                src={`/uploads/${testimonial.file.name}`} // Assuming the image path is similar
                alt={testimonial.file.name}
                className="preview-testimonial-image"
                style={{ maxWidth: '200px', width: '100%', height: '200px' }}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <p><strong>Description:</strong> {testimonial.description}</p>
        </>
      )}
    </div>
  );
}

export default PreviewTestimonial;