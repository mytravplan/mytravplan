
// /app/(admin)/admin/(cities)/cities/preview-city/[id]/page.jsx

'use client';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import React, { useEffect, useState } from 'react';

function PreviewPackage({ params }) {
  const { id } = params;
  const [pkgs, setPkgs] = useState({
    title: '',
    description: '',
    slug: '',
    packageOverview: '',
    packageTopSummary: '',
    packageItinerary: [],
    packages_galleries: [],
    packagesInclude: [],
    packagesExclude: [],
    images: [],
    package_under_categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchPkgs() {
    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/package/getbyid/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.result) && data.result.length > 0) {
        setPkgs(data.result[0]);  // Set the first item from the result array
      } else {
        setError(data.message || 'No package found');
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchPkgs();
  }, [id]);

  return (
    <div className="preview-continent-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <h2><strong>Package ID:</strong> {pkgs._id}</h2>
          <h2><strong>Package Name:</strong> {pkgs.title}</h2>
          <div className="package_image">
            {!pkgs.images || pkgs.images.length === 0 ? (
              <p>No images available</p>
            ) : (
              pkgs.images.map((image, index) => (
                <img
                  key={index}
                  src={`/uploads/${image.name}`}
                  alt={image.name}
                  className="preview-continent-image"
                  style={{ maxWidth: '200px', width: '100%', height: '200px' }}
                />
              ))
            )}
          </div>
          <p><strong>Package Description:</strong> {pkgs.description}</p>
          <p><strong>Slug:</strong> {pkgs.slug}</p>
          <p><strong>Overview:</strong> {pkgs.packageOverview}</p>
          <p><strong>Top Summary:</strong> {pkgs.packageTopSummary}</p>
          <h3>Itinerary:</h3>
          <ul>
            {pkgs.packageItinerary?.map((itinerary, index) => (
              <li key={index}>
                <p><strong>Day:</strong> {itinerary.day}</p>
                <p><strong>Location:</strong> {itinerary.location}</p>
                <p><strong>Tour Name:</strong> {itinerary.tourname}</p>
                <p><strong>Description:</strong> {itinerary.itinerary_description}</p>
              </li>
            ))}
          </ul>
          <table className="admin-packages-table">
            <thead>
              <tr>
                <th>Inclusions:</th>
                <th>Exclusions:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{pkgs.packagesInclude?.map((include, index) => (
                  <p key={index}>{include.description}</p>
                ))}</td>
                <td>{pkgs.packagesExclude?.map((exclude, index) => (
                  <p key={index}>{exclude.description}</p>
                ))}</td>
              </tr>
            </tbody>
          </table>
          <table className="admin-packages-table">
            <thead>
              <tr>
                <th>Package Price</th>
                <th>Discounted Price</th>
                <th>Days</th>
                <th>Nights</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₹{pkgs.package_price || 0}</td>
                <td>₹{pkgs.package_discounted_price || 0}</td>
                <td>{pkgs.package_days}</td>
                <td>{pkgs.package_nights}</td>
              </tr>
            </tbody>
          </table>
          <h3>Gallery:</h3>
          <div className="preview-continent-images" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {!pkgs.packages_galleries || pkgs.packages_galleries.length === 0 ? (
              <p>No images available</p>
            ) : (
              pkgs.packages_galleries.map((image, index) => (
                <img
                  key={index}
                  src={`/uploads/${image.name}`}
                  alt={image.name}
                  className="preview-continent-image"
                  style={{ width: '200px', height: '200px' }}
                />
              ))
            )}
          </div>
          <div className="packages_under_categories">
          <h2> package_under_categories</h2>
            {pkgs.package_under_categories===null && pkgs.package_under_categories===undefined ? (
              <p>no categories</p>
            ):(
              pkgs.package_under_categories.map((cat,index)=>{
                return(
                  <>
                  <ul key={index} className={`pkg_cat_${index + 1}`}>
                    <li> {index + 1}
                      <ul>
                    <li><strong>category Name:</strong> {cat.name}</li>
                      </ul>
                    </li>
                    
                  </ul>
                  </>
                )
              })
            )}
          </div>
          <div className="packages_under">
            <p><strong>Package under Continent:</strong> {pkgs.package_under_continent ? pkgs.package_under_continent.title : 'N/A'}</p>
            <p><strong>Package under Country:</strong> {pkgs.package_under_country ? pkgs.package_under_country.title : 'N/A'}</p>
            <p><strong>Package under City:</strong> {pkgs.package_under_city ? pkgs.package_under_city.title : 'N/A'}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default PreviewPackage;
