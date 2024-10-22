'use client';
import React, { useEffect, useState } from 'react';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

function PreviewTestimonialVideo({ params }) {
  const { id } = params;  

  console.log(`id`)
  console.log(id)
  const [testimonial, setTestimonial] = useState({
    name: '',
    description: '',
    videoUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log(`testimonial`)
  console.log(testimonial)

  // Fetch the testimonial video details
  async function fetchTestimonialVideo() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/video/get/${id}`);  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(`data`);
      console.log(data);
      if (data) {
        setTestimonial(data.result);  
      } else {
        setError(data.message || 'Testimonial video not found');
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchTestimonialVideo();  
  }, [id]);

  return (
    <div className="preview-testimonial-video-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>Name:</strong> {testimonial.name}</h2>
          <div className="testimonial-video">
            {testimonial.videoUrl ? (
              <video width="600" controls>
                <source src={testimonial.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No video available</p>
            )}
          </div>
          <p><strong>Description:</strong> {testimonial.description}</p>
        </>
      )}
    </div>
  );
}

export default PreviewTestimonialVideo;
