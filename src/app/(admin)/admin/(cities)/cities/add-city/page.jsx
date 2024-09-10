// /app/(admin)/admin/(cities)/cities/add-cities/page.jsx


'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { toast } from 'react-toastify';
import { InputGroup } from '@/hooks/slugUtils';


const AddCity = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    file: null,
    country_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {

      return handelAsyncErrors(async () => {
        const res = await fetch(`/api/v1/countries/get?page=1&limit=1000`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await res.json();
        setCountries(data.result || []);
      })
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { title, description, slug, file, country_id } = formData;

    if (!title || !description || !slug || !file || !country_id) {
      toast.error('Please fill in all fields and upload an image.')
      setIsLoading(false);
      return;
    }
    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('title', title);
      submissionData.append('description', description);
      submissionData.append('slug', slug);
      submissionData.append('file', file);
      submissionData.append('country_id', country_id);

      const res = await fetch('/api/v1/city/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'city added successfully')
        router.push('/admin/cities');
      } else {
        toast.error(data.message || 'An error occurred.');
      }

      setIsLoading(false);
    })


  };

  return (
    <div className="add-continent">
      <h2>Add City</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup
          title={formData.title}
          slug={formData.slug}
          setFormData={setFormData}
        />
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country._id} value={country._id}>
                {country.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="file">Image</label>
          <input type="file" id="file" name="file" onChange={handleChange} />
          {formData.file && (
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.file)} alt="Preview" />
            </div>
          )}
        </div>
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Add City'}
        </button>
      </form>
    </div>
  );
};

export default AddCity;
