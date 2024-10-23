'use client';
 import React, { useEffect, useState } from 'react';

function SlidersPage() {
  const [images, setImages] = useState([]);

  // Fetch all slider images
  useEffect(() => {
    const fetchAllSliderImages = async () => {
      const resp = await fetch('/api/v1/sliders/get');
      const data = await resp.json();
     
      if (data.success) {
        setImages(data?.result[0]?.galleries);  
      } else {
        console.error(data.message || 'Failed to fetch slider images');
      }
    };
    fetchAllSliderImages();
  }, []);

  console.log(`images`)
  console.log(images)

  return (
    <div>
      <h1>Slider Images</h1>
      <div className="slider-images">
        {images===undefined? (
          <p>No images available</p>
        ) : (
          images.map((image, index) => (
            <>
            
            <h2>{image?._id}</h2>
            <img
              key={index}
              src={`/uploads/${image?.name}`} 
              alt={image.name}
              style={{ maxWidth: '200px', width: '100%', height: '200px', margin: '10px' }}
            />
             </>
            
          ))
        )}
      </div>
    </div>
  );
}

export default SlidersPage;
