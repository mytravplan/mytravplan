'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const SliderUpdate = ({ params }) => {
  const { id } = params; // Get the slider ID from the URL
  const [slider, setSlider] = useState(null);
  const [formData, setFormData] = useState({
    galleries: []
  });
  const router = useRouter();




const fetchSlider = async () => {
  try {
    const response = await fetch(`/api/v1/slider/get/${id}`);
    const data = await response.json();
    if (data.success) {
      setSlider(data.result);
      setFormData({ galleries: data.result.galleries });
    } else {
      toast.error(data.message || 'Failed to fetch slider.');
    }
  } catch (error) {
    toast.error('Error fetching slider.');
  }
};

  useEffect(() => {
 

    fetchSlider();
  }, [id]);

  const deleteSingleImage=async(sliderid)=>{
    const response = await fetch(`/api/v1/sliders/delete/${sliderid}`,{method:'DELETE'});
    const data=await response.json()
    if(data){
      toast.success('image deleted successfuly')
      fetchSlider()
    }
  }

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
      const response = await fetch(`/api/v1/slider/update/${id}`, {
        method: 'PUT',
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Slider updated successfully.');
        router.push('/admin/slider');  
      } else {
        toast.error(data.message || 'Failed to update slider.');
      }
    } catch (error) {
      toast.error('Error updating slider.');
    }
  };

  if (!slider) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Update Slider</h2>
      <div>
        <h3>Current Images</h3>
        <div className="current-images" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {slider.galleries.length === 0 ? (
            <p>No images available</p>
          ) : (
            slider.galleries.map((image) => (
              <div key={image._id} className="slider-image-card" style={{ width: '100px' }}>
               
                <img
                  src={`/uploads/${image.name}`} 
                  alt={image.name}
                  style={{ width: '100px', height: '80px', objectFit: 'cover' }}
                  
                />
                <button onClick={()=>deleteSingleImage(image._id)}>X</button>
              </div>
            ))
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange}  />
        <button type="submit">Update Slider</button>
      </form>
    </div>
  );
};

export default SliderUpdate;
