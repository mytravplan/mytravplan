// /app/(admin)/admin/(countries)/countries/add-countries/page.jsx


'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { toast } from 'react-toastify';
import { InputGroup } from '@/hooks/slugUtils';


const AddCountry = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    file: null,
    sco_title:'',
    sco_description:'',
    continent_id: '',
    isShow: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [continents, setContinents] = useState([]);

  useEffect(() => {
    const fetchContinents = async () => {
      return handelAsyncErrors(async () => {
        const res = await fetch(`/api/v1/continents/get?page=1&limit=1000`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await res.json();
        setContinents(data.result || []);
      })


    };

    fetchContinents();
  }, []);



  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { title, description, slug, file, sco_title,sco_description,continent_id ,isShow} = formData;

    if (!title || !description || !slug || !file || !continent_id) {
      toast.error('Please fill in all fields and upload an image.');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('title', title);
      submissionData.append('description', description);
      submissionData.append('slug', slug);
      submissionData.append('file', file);
      submissionData.append('sco_title', sco_title);
      submissionData.append('sco_description', sco_description);
      submissionData.append('continent_id', continent_id);
      submissionData.append('isShow', isShow);

      const res = await fetch('/api/v1/country/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Country added successfully')
        router.push('/admin/countries');
      } else {
        toast.error(data.message || 'An error occurred.');
      }

      setIsLoading(false);
    })

  };

  return (
    <div className="add-continent">
      <h2>Add Country</h2>
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
          <label htmlFor="continent">Continent</label>
          <select
            id="continent"
            name="continent_id"
            value={formData.continent_id}
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
        <div className="form-group">
          <label htmlFor="file">Image</label>
          <input type="file" id="file" name="file" onChange={handleChange} />
          {formData.file && (
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.file)} alt="Preview" />
            </div>
          )}
        </div>
        <div className="form-group handelCheckbox">
              <label>
                
                 Do you want to enable this to be shown on the footer?
              </label>
              <input
                  type="checkbox"
                  name="isShow"
                  checked={formData.isShow}
                  onChange={handleChange}
                />
            </div>
        <div className="sco_panel">
              <h3>Add Country Seo meta keywords</h3>
              <div className="form-group">
              <label htmlFor="packages_galleries">Seo title</label>
                 <input
                type="text"
                id="sco_title"
                name="sco_title"
                value={formData.sco_title}
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
                value={formData.sco_description}
                onChange={handleChange}
                placeholder="Enter seo meta description"
              />
              </div>
              
            
            </div>
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Add Country'}
        </button>
      </form>
    </div>
  );
};

export default AddCountry;