
// /app/(admin)/admin/(continents)/continents/preview-continent/[id]/page.jsx

'use client';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import React, { useEffect, useState } from 'react';

function PreviewContinent({ params }) {
  const { id } = params;
  const [continent, setContinent] = useState({
    title: '',
    description: '',
    slug: '',
    images: [],
    cities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchContinent() {
    return handelAsyncErrors(async()=>{
      const response = await fetch(`/api/v1/continent/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
     
        if (data.success) {
          setContinent(data.result);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      
    
  }

  useEffect(() => {
    fetchContinent();
  }, [id]);

  return (
    <div className="preview-continent-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>continent Name:</strong> {continent.title}</h2>
          <p><strong>continent Description:</strong> {continent.description}</p>
          <p><strong>Slug:</strong> {continent.slug}</p>
          <div className="preview-continent-images">
            {continent.images.length > 0 ? (
              continent.images.map((image, index) => (
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
            <h3>countries: {continent.countries.length > 0 ? continent.countries.length : 0}</h3>
            <ul>
              {continent.countries.length > 0 ? (
                continent.countries.map((country, index) => (
                  <>
                    <ul>
                      <li> ...{index + 1}
                        <ul>
                          <li key={index}>{country._id}</li>
                          <li>{country.title}</li>
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

export default PreviewContinent;


