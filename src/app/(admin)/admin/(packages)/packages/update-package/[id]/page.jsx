'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
};

const UpdatePackage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    packageOverview: '',
    packageTopSummary: '',
    packageItinerary: [{ day: '', location: '', tourname: '', itinerary_description: '' }],
    packagesInclude: [{ description: '' }],
    packagesExclude: [{ description: '' }],
    file: null,
    gallery_files: [],
    city_id: [],
    package_price: '',
    package_discounted_price: '',
    package_days: '1',
    package_nights: '1',
    package_categories_id: [],
    sco_title: '',
    sco_description: '',
    isShow: false,
    package_hotel_name: ''
  });
  const [cities, setCities] = useState([]);
  const [cats, setCats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const fetchPackageData = async () => {
    try {
      const res = await fetch(`/api/v1/package/getbyid/${id}`);
      const data = await res.json();

      if (data.success) {
        const packageData = data.result[0];



        setFormData({
          title: packageData.title || '',
          description: packageData.description || '',
          slug: packageData.slug || '',
          packageOverview: packageData.packageOverview || '',
          packageTopSummary: packageData.packageTopSummary || '',
          packageItinerary: packageData.packageItinerary || [{ day: '', location: '', tourname: '', itinerary_description: '' }],
          packagesInclude: packageData.packagesInclude || [{ description: '' }],
          packagesExclude: packageData.packagesExclude || [{ description: '' }],
          file: null, // This will be for new uploads
          gallery_files: [], // This will be for new gallery uploads
          city_id: packageData.city_id?.map(city => city._id) || [],
          package_price: packageData.package_price || '',
          package_discounted_price: packageData.package_discounted_price || '',
          package_days: packageData.package_days?.toString() || '1',
          package_nights: packageData.package_nights?.toString() || '1',
          package_categories_id: packageData.package_under_categories?.map(cat => cat._id) || [],
          sco_title: packageData.sco_title || '',
          sco_description: packageData.sco_description || '',
          isShow: packageData.isShow || false,
          package_hotel_name: packageData.package_hotel_name || ''
        });

        if (packageData.images?.[0]) {
          setExistingMainImage(packageData.images[0]);
        }
        if (packageData.packages_galleries) {
          setExistingGalleryImages(packageData.packages_galleries);
        }
      } else {
        toast.error(data.message || 'Failed to fetch package data');
      }
    } catch (error) {
      toast.error('An error occurred while fetching package data.');
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch(`/api/v1/cities/get?page=1&limit=1000`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success) {
        setCities(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch cities');
      }
    } catch (error) {
      toast.error('An error occurred while fetching cities.');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/v1/package-categories/get?page=1&limit=1000`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success) {
        setCats(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      toast.error('An error occurred while fetching categories.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchCities();
      fetchPackageData();
      fetchCategories();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value,
    }));
  };

  const handleDynamicChange = (e, index, field) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedField = [...prevData[field]];
      updatedField[index][name] = value;
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleAddField = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], field === 'packageItinerary' ?
        { day: '', location: '', tourname: '', itinerary_description: '' } :
        { description: '' }]
    }));
  };

  const handleRemoveField = (index, field) => {
    setFormData((prevData) => {
      const updatedField = [...prevData[field]];
      updatedField.splice(index, 1);
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submissionData = new FormData();
      const {
        title,
        description,
        slug,
        packageOverview,
        packageTopSummary,
        packageItinerary,
        packagesInclude,
        packagesExclude,
        file,
        gallery_files,
        city_id,
        package_price,
        package_discounted_price,
        package_days,
        package_nights,
        package_categories_id,
        sco_title,
        sco_description,
        isShow,
        package_hotel_name
      } = formData;

      // Append all form data
      submissionData.append('title', title);
      submissionData.append('package_hotel_name', package_hotel_name);
      submissionData.append('description', description);
      submissionData.append('slug', slug);
      submissionData.append('package_price', package_price);
      submissionData.append('package_discounted_price', package_discounted_price);
      submissionData.append('package_days', package_days);
      submissionData.append('package_nights', package_nights);
      submissionData.append('package_overview', packageOverview);
      submissionData.append('package_top_summary', packageTopSummary);
      submissionData.append('package_itinerary', JSON.stringify(packageItinerary));
      submissionData.append('packages_include', JSON.stringify(packagesInclude));
      submissionData.append('packages_exclude', JSON.stringify(packagesExclude));
      submissionData.append('sco_title', sco_title);
      submissionData.append('sco_description', sco_description);
      submissionData.append('isShow', isShow);
      submissionData.append('package_categories_id', JSON.stringify(package_categories_id));
      submissionData.append('city_id', JSON.stringify(city_id));

      // Append files if they exist
      if (file) {
        submissionData.append('file', file);
      }

      // Append gallery files
      gallery_files.forEach((file) => {
        submissionData.append('gallery_files', file);
      });

      // Append existing images that haven't been removed
      submissionData.append('existing_images', JSON.stringify(existingImages));

      const res = await fetch(`/api/v1/package/update/${id}`, {
        method: 'PUT',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Package updated successfully!');
        router.push('/admin/packages');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the package.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-package-container">
      <h2>Update Package</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Enter slug"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="package_hotel_name">Hotel Name</label>
          <input
            type="text"
            id="package_hotel_name"
            name="package_hotel_name"
            value={formData.package_hotel_name}
            onChange={handleChange}
            placeholder="Enter hotel name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
            rows={5}
          />
        </div>

        {/* Pricing and Duration */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="package_price">Package Price</label>
            <input
              type="number"
              id="package_price"
              name="package_price"
              value={formData.package_price}
              onChange={handleChange}
              placeholder="Enter package price"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="package_discounted_price">Discounted Price</label>
            <input
              type="number"
              id="package_discounted_price"
              name="package_discounted_price"
              value={formData.package_discounted_price}
              onChange={handleChange}
              placeholder="Enter discounted price"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="package_days">Package Days</label>
            <select
              id="package_days"
              name="package_days"
              value={formData.package_days}
              onChange={handleChange}
              required
            >
              {generateOptions(1, 100).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="package_nights">Package Nights</label>
            <select
              id="package_nights"
              name="package_nights"
              value={formData.package_nights}
              onChange={handleChange}
              required
            >
              {generateOptions(1, 100).map((night) => (
                <option key={night} value={night}>{night}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview and Summary */}
        <div className="form-group">
          <label htmlFor="packageOverview">Package Overview</label>
          <textarea
            id="packageOverview"
            name="packageOverview"
            value={formData.packageOverview}
            onChange={handleChange}
            placeholder="Enter package overview"
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="packageTopSummary">Top Summary</label>
          <textarea
            id="packageTopSummary"
            name="packageTopSummary"
            value={formData.packageTopSummary}
            onChange={handleChange}
            placeholder="Enter top summary"
            rows={5}
          />
        </div>

        {/* Categories and Cities - Multi-select */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="package_categories_id">Categories</label>
            <select
              id="package_categories_id"
              name="package_categories_id"
              value={formData.package_categories_id}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, package_categories_id: selected }));
              }}
              multiple
              className="multi-select"
            >
              {cats.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>

          <div className="form-group">
            <label htmlFor="city_id">Select a city (Multiple Select) </label>
            <select
              id="city_id"
              name="city_id"
              value={formData.city_id}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData(prev => ({ ...prev, city_id: selected }));
              }}
              multiple
              className="multi-select"
            >
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.title}
                </option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>
        </div>

        {/* Itinerary */}
        <div className="form-group">
          <label>Package Itinerary</label>
          {formData.packageItinerary.map((item, index) => (
            <div key={index} className="itinerary-item">
              <div className="form-row">
                <input
                  type="text"
                  name="day"
                  value={item.day}
                  onChange={(e) => handleDynamicChange(e, index, 'packageItinerary')}
                  placeholder="Day"
                  className="small-input"
                />
                <input
                  type="text"
                  name="location"
                  value={item.location}
                  onChange={(e) => handleDynamicChange(e, index, 'packageItinerary')}
                  placeholder="Location"
                />
                <input
                  type="text"
                  name="tourname"
                  value={item.tourname}
                  onChange={(e) => handleDynamicChange(e, index, 'packageItinerary')}
                  placeholder="Tour Name"
                />
              </div>
              <textarea
                name="itinerary_description"
                value={item.itinerary_description}
                onChange={(e) => handleDynamicChange(e, index, 'packageItinerary')}
                placeholder="Itinerary Description"
                rows={3}
              />
              <button
                type="button"
                onClick={() => handleRemoveField(index, 'packageItinerary')}
                className="remove-btn"
              >
                <FaMinus /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('packageItinerary')}
            className="add-btn"
          >
            Add Itinerary Item
          </button>
        </div>

        {/* Includes */}
        <div className="form-group">
          <label>Packages Include</label>
          {formData.packagesInclude.map((item, index) => (
            <div key={index} className="include-exclude-item">
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleDynamicChange(e, index, 'packagesInclude')}
                placeholder="Include Description"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(index, 'packagesInclude')}
                className="remove-btn"
              >
                <FaMinus /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('packagesInclude')}
            className="add-btn"
          >
            Add Include Item
          </button>
        </div>

        {/* Excludes */}
        <div className="form-group">
          <label>Packages Exclude</label>
          {formData.packagesExclude.map((item, index) => (
            <div key={index} className="include-exclude-item">
              <input
                type="text"
                name="description"
                value={item.description}
                onChange={(e) => handleDynamicChange(e, index, 'packagesExclude')}
                placeholder="Exclude Description"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(index, 'packagesExclude')}
                className="remove-btn"
              >
                <FaMinus /> Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField('packagesExclude')}
            className="add-btn"
          >
            Add Exclude Item
          </button>
        </div>


        <div className="form-group">
          <label>Main Image</label>
          {existingMainImage && (
            <div className="image-preview-prev">
              <img
                src={`/uploads/${existingMainImage.name}`}
                alt="Current main image"
                className="thumbnail"
              />
              <button
                type="button"
                onClick={() => setExistingMainImage(null)}
                className="remove-btn"
              >
                <FaMinus /> Remove
              </button>
            </div>
          )}
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
          />
          <small>Leave empty to keep current image</small>
        </div>

        <div className="form-group">
          <label>Gallery Images</label>
          <div className="gallery-grid-prev">
            {existingGalleryImages.map((image, index) => (
              <div key={image._id} className="gallery-item">
                <img
                  src={`/uploads/${image.name}`}
                  alt={`Gallery image ${index + 1}`}
                  className="thumbnail"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...existingGalleryImages];
                    updated.splice(index, 1);
                    setExistingGalleryImages(updated);
                  }}
                  className="remove-btn"
                >
                  <FaMinus /> Remove
                </button>
              </div>
            ))}
          </div>

        </div>

        <div className="form-group">
          <label htmlFor="gallery_files">Add More Gallery Images</label>
          <input
            type="file"
            id="gallery_files"
            name="gallery_files"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setFormData(prev => ({
                ...prev,
                gallery_files: [...prev.gallery_files, ...files]
              }));
            }}
          />
        </div>


        <div className="form-group handelCheckbox">
          <label>
            <input
              type="checkbox"
              name="isShow"
              checked={formData.isShow}
              onChange={handleChange}
            />
            Show on home page
          </label>
        </div>


        <div className="sco_panel">
          <h3>SEO Meta Information</h3>
          <div className="form-group">
            <label htmlFor="sco_title">SEO Title</label>
            <input
              type="text"
              id="sco_title"
              name="sco_title"
              value={formData.sco_title}
              onChange={handleChange}
              placeholder="Enter SEO meta title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sco_description">SEO Description</label>
            <textarea
              id="sco_description"
              name="sco_description"
              value={formData.sco_description}
              onChange={handleChange}
              placeholder="Enter SEO meta description"
              rows={3}
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Updating...' : 'Update Package'}
        </button>
      </form>


    </div>
  );
};

export default UpdatePackage;