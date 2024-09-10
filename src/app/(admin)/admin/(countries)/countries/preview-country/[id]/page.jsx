
// /app/(admin)/admin/(countries)/countries/preview-country/[id]/page.jsx

'use client';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import React, { useEffect, useState } from 'react';

function PreviewCountry({ params }) {
  const { id } = params;
  const [country, setCountry] = useState({
    title: '',
    description: '',
    slug: '',
    images: [],
    cities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchCountry() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/country/get/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setCountry(data.result);
      } else {
        setError(data.message);
      }
      setLoading(false);
    })
      
    
  }

  useEffect(() => {
    fetchCountry();
  }, [id]);

  return (
    <div className="preview-continent-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>Country Name:</strong> {country.title}</h2>
          <p><strong>Country Description:</strong> {country.description}</p>
          <p><strong>Slug:</strong> {country.slug}</p>
          <div className="preview-continent-images">
            {country.images.length > 0 ? (
              country.images.map((image, index) => (
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
            <h3>Cities: {country.cities.length > 0 ? country.cities.length : 0}</h3>
            <ul>
              {country.cities.length > 0 ? (
                country.cities.map((city, index) => (
                 <>
                 <ul>
                  <li> ...{index + 1}
                    <ul>
                    <li key={index}>{city._id}</li>
                  <li>{city.title}</li>
                  <li>{city.city_packages_count}</li>
                    </ul>
                  </li>
                 </ul>
                  
                 </>
                ))
              ) : (
                <li>No data available</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default PreviewCountry;


