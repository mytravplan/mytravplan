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
    sco_title: '',
    sco_description: '',
    images: [],
    imageFile: null,
    imagePreviewUrl: '',
    continent_id: '',
    isShow: false 
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [continents, setContinents] = useState([]);
  const router = useRouter();
  const { id } = params;

  console.log(`country`)
  console.log(country)

  const fetchContinents = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch('/api/v1/continents/get?page=1&limit=1000', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      setContinents(data.result || []);
    });
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
          images: data.result.images.map(img => img.name),
          continent_id: data.result.continent_id || '',
          isShow: data.result.isShow // Set isShow from fetched data
        });
      } else {
        toast.error(data.message || 'An error occurred');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchContinents();
    fetchCountry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCountry((prevCountry) => ({
          ...prevCountry,
          imageFile: file,
          imagePreviewUrl: reader.result,
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setCountry((prevCountry) => ({
        ...prevCountry,
        [name]: checked, // Handle checkbox
      }));
    } else {
      setCountry((prevCountry) => ({
        ...prevCountry,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', country.title);
    formData.append('slug', country.slug);
    formData.append('description', country.description);
    formData.append('sco_title', country.sco_title);
    formData.append('sco_description', country.sco_description);
    formData.append('continent_id', country.continent_id);
    formData.append('isShow', country.isShow); // Include isShow in form data
    if (country.imageFile) {
      formData.append('file', country.imageFile);
    } else {
      formData.append('file', '');
    }

    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/country/update/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Country updated successfully!');
        setTimeout(() => router.push('/admin/countries'), 2000);
      } else {
        toast.error(data.message || 'An error occurred');
      }
      setIsLoading(false);
    });
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
          <div className="form-group handelCheckbox">
            <label>
              Do you want to enable this to be shown on the footer?
            </label>
            <input
              type="checkbox"
              name="isShow"
              checked={country.isShow} // Reflect current isShow state
              onChange={handleChange}
            />
          </div>
          <div className="sco_panel">
            <h3>Update Country Sco meta keywords</h3>
            <div className="form-group">
              <label htmlFor="packages_galleries">Seo title</label>
              <input
                type="text"
                id="sco_title"
                name="sco_title"
                value={country.sco_title}
                onChange={handleChange}
                placeholder="Enter seo meta title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="packages_galleries">Seo description</label>
              <input
                type="text"
                id="sco_description"
                name="sco_description"
                value={country.sco_description}
                onChange={handleChange}
                placeholder="Enter seo meta description"
              />
            </div>
          </div>
          <button type="submit" className="update-packages-button" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Country'}
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateCountry;
