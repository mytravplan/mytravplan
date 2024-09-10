// /app/(admin)/admin/(continents)/continents/update-continent/[id]/page.jsx


'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { toast } from 'react-toastify';

function UpdateContinent({ params }) {
  const [continent, setContinent] = useState({
    title: '',
    slug: '',
    description: '',
    images: [], // This will hold the current image list
    imageFile: null, // This will hold the new image file
    imagePreviewUrl: '', // This will hold the preview URL of the new image
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const router = useRouter();
  const { id } = params;

  async function fetchContinent() {
      return handelAsyncErrors(async()=>{
        const response = await fetch(`/api/v1/continent/getbyid/${id}`);
        const data = await response.json();
        if (data.success) {
          setContinent({
            ...data.result,
            images: data.result.images.map(img => ({
              ...img,
              imgurl: img.imgurl || '',
            })), // Ensure images have imgurl
          });
          console.log('Data:', data);
        } else {
          toast.error(data.message|| 'An error occurred');
        }
        setLoading(false);
      })
     
    
  }

  useEffect(() => {
    fetchContinent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setContinent((prevContinent) => ({
          ...prevContinent,
          imageFile: file,
          imagePreviewUrl: reader.result, // Create a preview URL for the new image
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setContinent((prevContinent) => ({
        ...prevContinent,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append('title', continent.title);
    formData.append('slug', continent.slug);
    formData.append('description', continent.description);
    if (continent.imageFile) {
      formData.append('file', continent.imageFile); // Upload new image
    }

    return handelAsyncErrors(async()=>{
      const response = await fetch(`/api/v1/continent/update/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message ||'Continent updated successfully!');
        setTimeout(() => router.push('/admin/continents'), 2000); // Redirect after success
      } else {
        toast.error(data.message || 'An error occurred');
      }
      setIsLoading(false); // End loading
    })
     
    
  };

  return (
    <div className="update-packages-container">
      <h2 className="update-packages-heading">Update Continent</h2>
      {loading && <p className="update-packages-loading">Loading...</p>}
      {!loading && (
        <form className="update-packages-form" onSubmit={handleSubmit}>
          <label className="update-packages-label">
            Title:
            <input
              type="text"
              name="title"
              value={continent.title}
              onChange={handleChange}
              className="update-packages-input"
              required
            />
          </label>
          <label className="update-packages-label">
            Slug:
            <input
              type="text"
              name="slug"
              value={continent.slug}
              onChange={handleChange}
              className="update-packages-input"
              required
            />
          </label>
          <label className="update-packages-label">
            Description:
            <textarea
              name="description"
              value={continent.description}
              onChange={handleChange}
              className="update-packages-textarea"
              required
            />
          </label>
          <label className="update-packages-label">
            Image:
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="update-packages-file-input"
            />
            <div className="update-packages-image-preview">
              {continent.imagePreviewUrl ? (
                <img
                  src={continent.imagePreviewUrl}
                  alt="New"
                  className="update-packages-image"
                />
              ) : (
                continent.images.length > 0 ? (
                  continent.images.map((image, index) => (
                    <img
                      key={index}
                      src={`/uploads/${image.name}`}
                      alt={image.name}
                      className="update-packages-image"
                    />
                  ))
                ) : (
                  <p>No current images available</p>
                )
              )}
            </div>
          </label>
          <button type="submit" className="update-packages-button" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Continent'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateContinent;

