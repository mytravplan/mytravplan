'use client';

import React, { useEffect, useState } from 'react';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

function PreviewTransfer({ params }) {
  const { id } = params;
  const [transfer, setTransfer] = useState({
    transfer_title: '',
    transfer_price: '',
    transfer_overview_description: '',
    transfer_slug: '',
    transfer_image: '',
    transfer_galleries: [],
    seo_title: '',
    seo_description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransfer = async () => {
      return handelAsyncErrors(async () => {
        const response = await fetch(`/api/v1/transfer/get/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
 
        if (data) {
          setTransfer(data.result);
        } else {
          setError(data.message);
        }
        setLoading(false);
      });
    };

    fetchTransfer();
  }, [id]);

  return (
    <div className="preview-transfer-container">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <p>
            <strong>Title:</strong> {transfer.transfer_title}
          </p>
          <p>
            <strong>Price:</strong> {transfer.transfer_price}
          </p>
          <p>
            <strong>Slug:</strong> {transfer.transfer_slug}
          </p>
          <p>
            <strong>Overview Description:</strong>{' '}
            {transfer.transfer_overview_description}
          </p>

          <div className="preview-transfer-main-image">
            <h3>Main Image:</h3>
            {transfer.transfer_image ? (
              <img
                src={transfer.transfer_image}
                alt={transfer.transfer_title}
                className="preview-transfer-image"
              />
            ) : (
              <p>No main image available</p>
            )}
          </div>

          <div className="preview-transfer-gallery">
            <h3>Gallery Images:</h3>
            {Array.isArray(transfer.transfer_galleries) &&
            transfer.transfer_galleries.length > 0 ? (
              <div className="preview-transfer-images">
                {transfer.transfer_galleries.map((fileName, index) => (
                  <img
                    key={index}
                    src={{fileName}}
                    alt={`Gallery ${index + 1}`}
                    className="preview-transfer-image"
                  />
                ))}
              </div>
            ) : (
              <p>No gallery images available</p>
            )}
          </div>

          <div className="preview-transfer-seo">
            <h3>SEO Meta</h3>
            <p>
              <strong>SEO Title:</strong> {transfer.seo_title || 'N/A'}
            </p>
            <p>
              <strong>SEO Description:</strong>{' '}
              {transfer.seo_description || 'N/A'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default PreviewTransfer;
