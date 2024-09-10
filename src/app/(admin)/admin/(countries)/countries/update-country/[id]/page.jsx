// // /app/(admin)/admin/(countries)/countries/update-country/[id]/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { toast } from 'react-toastify';

function UpdateCountry({ params }) {
  const [country, setCountry] = useState({
    title: '',
    slug: '',
    description: '',
    images: [], // This will hold the current image list
    imageFile: null, // This will hold the new image file
    imagePreviewUrl: '', // This will hold the preview URL of the new image
    continent_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [continents, setContinents] = useState([]);
  const router = useRouter();
  const { id } = params;

 
    const fetchContinents = async () => {
      return handelAsyncErrors(async () => {
        const res = await fetch('/api/v1/continents/get?page=1&limit=1000', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await res.json();
        setContinents(data.result || []);
      })
        
      
    };

    const fetchCountry = async () => {
      return handelAsyncErrors(async () => {
        const response = await fetch(`/api/v1/country/get/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setCountry({
            ...data.result,
            images: data.result.images.map(img => img.name), // Extract image names
            continent_id : data.result.continent_id || ''
          });
          console.log('Data:', data);
        } else {
          toast.error(data.message || 'An error occurred');
        }
        setLoading(false);
      })
    };
    useEffect(() => {
    fetchContinents();
    fetchCountry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCountry((prevCountry) => ({
          ...prevCountry,
          imageFile: file,
          imagePreviewUrl: reader.result, // Create a preview URL for the new image
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setCountry((prevCountry) => ({
        ...prevCountry,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append('title', country.title);
    formData.append('slug', country.slug);
    formData.append('description', country.description);
    formData.append('continent_id', country.continent_id);
    if (country.imageFile) {
      formData.append('file', country.imageFile); // Upload new image
    } else {
      formData.append('file', ''); // Ensure file field is included if no new image
    }

    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/country/update/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success( data.message || 'Country updated successfully!');
        setTimeout(() => router.push('/admin/countries'), 2000); // Redirect after success
      } else {
        toast.error(data.message || 'An error occurred');
      }
      setIsLoading(false); // End loading
    })
      
    
  };

  return (
    <div className="update-packages-container">
      <h2 className="update-packages-heading">Update Country</h2>
      {loading && <p className="update-packages-loading">Loading...</p>}
      {!loading && (
        <form className="update-packages-form" onSubmit={handleSubmit}>
          <label className="update-packages-label">
            Title:
            <input
              type="text"
              name="title"
              value={country.title}
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
              value={country.slug}
              onChange={handleChange}
              className="update-packages-input"
              required
            />
          </label>
          <label className="update-packages-label">
            Description:
            <textarea
              name="description"
              value={country.description}
              onChange={handleChange}
              className="update-packages-textarea"
              required
            />
          </label>
          <div className="form-group">
            <label htmlFor="continent">Continent</label>
            <select
              id="continent"
              name="continent_id"
              value={country.continent_id}
              onChange={handleChange}
            >
              <option value="">Select a continent</option>
              {continents.map((continent) => (
                <option key={continent._id} value={continent._id}>
                  {continent.title}
                </option>
              ))}
            </select>
          </div>
          <label className="update-packages-label">
            Image:
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="update-packages-file-input"
            />
            <div className="update-packages-image-preview">
              {country.imagePreviewUrl ? (
                <img
                  src={country.imagePreviewUrl}
                  alt="New"
                  className="update-packages-image"
                />
              ) : (
                country.images.map((image, index) => (
                  <img
                    key={index}
                    src={`/uploads/${image}`}
                    alt={`Current ${image}`}
                    className="update-packages-image"
                  />
                ))
              )}
            </div>
          </label>
          <button type="submit" className="update-packages-button" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Country'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateCountry;
