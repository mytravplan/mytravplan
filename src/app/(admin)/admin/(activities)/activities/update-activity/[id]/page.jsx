// // // /app/(admin)/admin/(activities)/activities/update-activity/[id]/page.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

const UpdateActivity = ({ params }) => {
  const [activity, setActivity] = useState({
    title: '',
    description: '',
    slug: '',
    activity_overview: '',
    activity_top_summary: '',
    images: [],
    file: null,
    imagePreviewUrl: '',
    icon: [],
    iconfile: null,
    iconPreviewUrl: '',
    gallery_files: [],
    galleryPreviewUrls: [],
    city_id: '',
    activity_price: '',
    activity_discounted_price: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const router = useRouter();
  const { id } = params;

  // Fetch cities for dropdown
  const fetchCities = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch('/api/v1/cities/get?page=1&limit=1000', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        setCities(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch cities');
      }
    });
  };

  // Fetch activity data by ID
  const fetchActivity = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch(`/api/v1/activity/getbyid/${id}`);
      const data = await res.json();
      if (data.success) {
        const { result } = data;
        setActivity({
          title: result.title || '',
          description: result.description || '',
          slug: result.slug || '',
          activity_overview: result.activity_overview || '',
          activity_top_summary: result.activity_top_summary || '',
          images: result.images || [],
          file: null,
          iconfile: null,
          iconPreviewUrl: result.icon.length ? `/uploads/${result.icon[0].name}` : '',
          gallery_files: [],
          galleryPreviewUrls: result.activity_galleries.map((file) => `/uploads/${file.name}`) || [],
          city_id: result.city_id ? result.city_id._id : '',
          activity_price: result.activity_price || '',
          activity_discounted_price: result.activity_discounted_price || '',
        });
        setIsLoading(false);
      } else {
        toast.error(data.message || 'Failed to fetch activity');
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchCities();
    fetchActivity();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setActivity((prevActivity) => ({
          ...prevActivity,
          file: file,
          imagePreviewUrl: reader.result,
        }));
      };
      if (file) reader.readAsDataURL(file);
    } else if (name === 'icon') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setActivity((prevActivity) => ({
          ...prevActivity,
          iconfile: file,
          iconPreviewUrl: reader.result,
        }));
      };
      if (file) reader.readAsDataURL(file);
    } else if (name === 'gallery_files') {
      const galleryFiles = Array.from(files);
      const galleryPreviews = galleryFiles.map(file => URL.createObjectURL(file)); // Create previews

      setActivity((prevActivity) => ({
        ...prevActivity,
        gallery_files: galleryFiles,
        galleryPreviewUrls: galleryPreviews,
      }));
    } else {
      setActivity((prevActivity) => ({
        ...prevActivity,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      title,
      description,
      slug,
      activity_overview,
      activity_top_summary,
      file,
      iconfile,
      gallery_files,
      city_id,
      activity_price,
      activity_discounted_price,
    } = activity;

    if (
      !title ||
      !description ||
      !slug ||
      !activity_overview ||
      !activity_top_summary ||
      !city_id ||
      !activity_price ||
      !activity_discounted_price
    ) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('slug', slug);
    formData.append('activity_overview', activity_overview);
    formData.append('activity_top_summary', activity_top_summary);
    if (file) formData.append('file', file);
    if (iconfile) formData.append('icon', iconfile);
    gallery_files.forEach((file) => formData.append('activity_galleries', file));
    formData.append('city_id', city_id);
    formData.append('activity_price', activity_price);
    formData.append('activity_discounted_price', activity_discounted_price);

    return handelAsyncErrors(async () => {
      const res = await fetch(`/api/v1/activity/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Activity updated successfully!');
        router.push('/admin/activities');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
      setIsSubmitting(false);
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="update-activity-container">
      <h2>Update Activity</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={activity.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={activity.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Slug:
          <input
            type="text"
            name="slug"
            value={activity.slug}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Activity Overview:
          <textarea
            name="activity_overview"
            value={activity.activity_overview}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Activity Top Summary:
          <textarea
            name="activity_top_summary"
            value={activity.activity_top_summary}
            onChange={handleChange}
            required
          />
        </label>
        <label className="update-packages-label">
          Image:
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="update-packages-file-input"
          />
          <div className="update-packages-image-preview">
            {activity.imagePreviewUrl ? (
              <img
                src={activity.imagePreviewUrl}
                alt="New"
                className="update-packages-image"
                style={{width: '100px', height: '100px'}}
              />
            ) : activity.images.length > 0 ? (
              activity.images.map((image, index) => (
                <img
                  key={index}
                  src={`/uploads/${image.name}`}
                  alt={`Current ${image.name}`}
                  className="update-packages-image"
                  style={{width: '100px', height: '100px'}}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </label>
        <label className="update-packages-label">
          Icon:
          <input
            type="file"
            name="icon"
            onChange={handleChange}
            className="update-packages-file-input"
          />
          <div className="update-packages-icon-preview">
            {activity.iconPreviewUrl ? (
              <img
                src={activity.iconPreviewUrl}
                alt="Icon Preview"
                className="update-packages-icon"
                style={{width: '100px', height: '100px'}}
              />
            ) : activity.icon=== null && activity.icon=== undefined ? (
              activity.icon.map((i, index) => (
                <img
                  src={`/uploads/${i.name}`}
                  key={index}
                  alt="Current Icon"
                  className="update-packages-icon"
                  style={{width: '100px', height: '100px'}}
                />
              ))
            ) : (
              <p>No icon available</p>
            )}
          </div>
        </label>
        <label className="update-packages-label">
          Gallery:
          <input
            type="file"
            name="gallery_files"
            multiple
            onChange={handleChange}
            className="update-packages-file-input"
          />
          <div className="update-packages-gallery-preview">
            {activity.galleryPreviewUrls.length > 0 ? (
              activity.galleryPreviewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Gallery ${index}`}
                  className="update-packages-gallery-image"
                  style={{width: '100px', height: '100px'}}
                />
              ))
            ) : (
              <p>No gallery images available</p>
            )}
          </div>
        </label>
        <label>
          City:
          <select
            name="city_id"
            value={activity.city_id}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price:
          <input
            type="number"
            name="activity_price"
            value={activity.activity_price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Discounted Price:
          <input
            type="number"
            name="activity_discounted_price"
            value={activity.activity_discounted_price}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Activity'}
        </button>
      </form>
    </div>
  );
};

export default UpdateActivity;
