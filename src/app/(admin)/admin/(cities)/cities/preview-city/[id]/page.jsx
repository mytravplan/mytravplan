
// /app/(admin)/admin/(cities)/cities/preview-city/[id]/page.jsx

'use client';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import React, { useEffect, useState } from 'react';

function PreviewCity({ params }) {
  const { id } = params;
  const [city, setCity] = useState({
    title: '',
    description: '',
    slug: '',
    images: [],
    all_packages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchCity() {
   
      const response = await fetch(`/api/v1/city/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
     return handelAsyncErrors(async()=>{
        if (data.success) {
          setCity(data.result);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      
    
  }

  useEffect(() => {
    fetchCity();
  }, [id]);

  return (
    <div className="preview-continent-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>City Name:</strong> {city.title}</h2>
          <p><strong>City Description:</strong> {city.description}</p>
          <p><strong>Slug:</strong> {city.slug}</p>
          <div className="preview-continent-images">
            {city.images.length > 0 ? (
              city.images.map((image, index) => (
                <img
                  key={index}
                  src={`/uploads/${image.name}`}
                  alt={image.name}
                  className="preview-continent-image"
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="preview-continent-countries">
            <h3>Packages: {city.all_packages.length > 0 ? city.all_packages.length : 0}</h3>
          </div>
        </>
      )}
    </div>
  );
}

export default PreviewCity;


