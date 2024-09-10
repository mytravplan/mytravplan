// /app/(admin)/admin/(activites)/activites/add-Activity/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { InputGroup } from '@/hooks/slugUtils';

const AddActivity = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    activityOverview: '',
    activityTopSummary: '',
    file: null,
    icon: null,
    gallery_files: [],
    city_id: '',
    activity_price: '',
    activity_discounted_price: '',
  });

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCities = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch('/api/v1/cities/get?page=1&limit=1000', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await res.json();
      if (data.success) {
        setCities(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch cities');
      }
    });
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      gallery_files: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      title,
      description,
      slug,
      activityOverview,
      activityTopSummary,
      file,
      icon,
      gallery_files,
      city_id,
      activity_price,
      activity_discounted_price,
    } = formData;

    if (
      !title ||
      !description ||
      !slug ||
      !activityOverview ||
      !activityTopSummary ||
      !file ||
      !icon ||
      gallery_files.length === 0 ||
      !city_id ||
      !activity_price ||
      !activity_discounted_price
    ) {
      toast.error('Please fill in all required fields and upload images.');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('title', title);
      submissionData.append('description', description);
      submissionData.append('slug', slug);
      submissionData.append('activity_overview', activityOverview);
      submissionData.append('activity_top_summary', activityTopSummary);
      submissionData.append('file', file);
      submissionData.append('icon', icon);
      submissionData.append('activity_price', activity_price);
      submissionData.append('activity_discounted_price', activity_discounted_price);
      submissionData.append('city_id', city_id);

      gallery_files.forEach((file) => {
        submissionData.append('activity_galleries', file);
      });

      const res = await fetch('/api/v1/activity/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Activity added successfully!');
        router.push('/admin/activities');
      } else {
        toast.error(data.message || 'An error occurred.');
      }

      setIsLoading(false);
    });
  };

  return (
    <div className="add-activity-container">
      <h2>Add Activity</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup
          title={formData.title}
          slug={formData.slug}
          setFormData={setFormData}
        />
        <div className='form-group'>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="activityOverview">Activity Overview</label>
          <textarea
            name="activityOverview"
            value={formData.activityOverview}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="activityTopSummary">Activity Top Summary</label>
          <textarea
            name="activityTopSummary"
            value={formData.activityTopSummary}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="file">Main Image</label>
          <input type="file" name="file" onChange={handleChange} required />
        </div>
        <div className='form-group'>
          <label htmlFor="icon">Icon</label>
          <input type="file" name="icon" onChange={handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor="gallery_files">Gallery Images</label>
          <input type="file" name="gallery_files" onChange={handleGalleryChange} multiple />
        </div>
        <div className='form-group'>
          <label htmlFor="city_id">City</label>
          <select name="city_id" value={formData.city_id} onChange={handleChange} required>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.title}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor="activity_price">Price</label>
          <input
            type="number"
            name="activity_price"
            value={formData.activity_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor="activity_discounted_price">Discounted Price</label>
          <input
            type="number"
            name="activity_discounted_price"
            value={formData.activity_discounted_price}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Activity'}
        </button>
      </form>
    </div>
  );
};

export default AddActivity;
