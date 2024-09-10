
// /app/(admin)/admin/(activities)/activities/preview-activity/[id]/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

function PreviewActivity({ params }) {
  const { id } = params;
  const [activity, setActivity] = useState({
    title: '',
    description: '',
    slug: '',
    activity_price: '',
    activity_discounted_price: '',
    activity_overview: '',
    activity_top_summary: '',
    images: [],
    icon: [],
    activity_galleries: [],
    activity_under_continent: {},
    activity_under_country: {},
    activity_under_city: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchActivity() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/activity/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        setActivity(data.result);
      } else {
        setError(data.message);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchActivity();
  }, [id]);

  return (
    <div className="preview-activity-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>Activity Title:</strong> {activity.title}</h2>
          <div className="activity-image">
            {activity.images.length > 0 ? (
              activity.images.map((image, index) => (
                <img
                  key={index}
                  src={`/uploads/${image.name}`}
                  alt={image.name}
                  className="preview-activity-image"
                  style={{ maxWidth: '200px', width: '100%', height: '200px' }}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="activity-icon">
            {activity.icon.length > 0 ? (
              <img
                src={`/uploads/${activity.icon[0].name}`}
                alt="Icon"
                className="preview-activity-icon"
                style={{ width: '100px', height: '100px' }}
              />
            ) : (
              <p>No icon available</p>
            )}
          </div>
          <p><strong>Description:</strong> {activity.description}</p>
          <p><strong>Slug:</strong> {activity.slug}</p>
          <p><strong>Activity Price:</strong> {activity.activity_price}</p>
          <p><strong>Discounted Price:</strong> {activity.activity_discounted_price}</p>
          <p><strong>Overview:</strong> {activity.activity_overview}</p>
          <p><strong>Top Summary:</strong> {activity.activity_top_summary}</p>
          
          <h3>Gallery:</h3>
          <div className="preview-activity-gallery" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {activity.activity_galleries.length > 0 ? (
              activity.activity_galleries.map((gallery, index) => (
                <img
                  key={index}
                  src={`/uploads/${gallery.name}`}
                  alt={`Gallery Image ${index + 1}`}
                  className="preview-activity-gallery-image"
                  style={{ width: '200px', height: '200px' }}
                />
              ))
            ) : (
              <p>No gallery images available</p>
            )}
          </div>
          
          <div>
            <h3>Location</h3>
            <p><strong>Continent:</strong> {activity.activity_under_continent?.title || 'N/A'}</p>
            <p><strong>Country:</strong> {activity.activity_under_country?.title || 'N/A'}</p>
            <p><strong>City:</strong> {activity.activity_under_city?.title || 'N/A'}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default PreviewActivity;
