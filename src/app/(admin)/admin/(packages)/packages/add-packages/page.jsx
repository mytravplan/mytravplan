'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './AddPackages.css';
import { FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import PackageCategories from '../../package-category/PackageCategories';
import { InputGroup } from '@/hooks/slugUtils';
import Select from 'react-select';

const generateOptions = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
};

const AddPackages = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    packageOverview: '',
    packageTopSummary: '',
    packageItinerary: [{ day: '', location: '', tourname: '', itinerary_description: '' }],
    hotel_activities: [{ hotel_name: '', activity_description: '' }],  
    packagesInclude: [{ description: '' }],
    packagesExclude: [{ description: '' }],
    file: null,
    packages_galleries: [],
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

  const cityOptions = cities.map(city => ({
    value: city._id,
    label: city.title
  }));

  const categoryOptions = cats.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  const selectedCities = cityOptions.filter(option =>
    formData.city_id.includes(option.value)
  );
  const selectedCategories = categoryOptions.filter(option =>
    formData.package_categories_id.includes(option.value)
  );

  const fetchCities = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch(`/api/v1/cities/get?page=1&limit=1000`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) {
        setCities(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch cities');
      }
    });
  };

  const fetchCategories = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch(`/api/v1/package-categories/get?page=1&limit=1000`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      if (data.success) {
        setCats(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch categories');
      }
    });
  };

  useEffect(() => {
    fetchCities();
    fetchCategories();
  }, []);

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
    setFormData((prevData) => {
      if (field === 'hotel_activities') {
        return {
          ...prevData,
          hotel_activities: [
            ...prevData.hotel_activities,
            { hotel_name: '', activity_description: '' }
          ]
        };
      }
      if (field === 'packageItinerary') {
        return {
          ...prevData,
          packageItinerary: [
            ...prevData.packageItinerary,
            { day: '', location: '', tourname: '', itinerary_description: '' }
          ]
        };
      }
   
      return {
        ...prevData,
        [field]: [...prevData[field], { description: '' }]
      };
    });
  };
 

  const handleRemoveField = (index, field) => {
    setFormData((prevData) => {
      const updatedField = [...prevData[field]];
      updatedField.splice(index, 1);
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleCityChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      city_id: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      package_categories_id: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      title,
      description,
      slug,
      packageOverview,
      packageTopSummary,
      packageItinerary,
      hotel_activities,
      packagesInclude,
      packagesExclude,
      file,
      packages_galleries,
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

    if (!title || !description || !slug || !file || !city_id.length) {
      toast.error('Please fill in all required fields and upload an image.');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('package_hotel_name', package_hotel_name);
      submissionData.append('title', title);
      submissionData.append('description', description);
      submissionData.append('slug', slug);
      submissionData.append('package_price', package_price);
      submissionData.append('package_discounted_price', package_discounted_price);
      submissionData.append('package_days', package_days);
      submissionData.append('package_nights', package_nights);
      submissionData.append('package_overview', packageOverview);
      submissionData.append('package_top_summary', packageTopSummary);
      submissionData.append('package_itinerary', JSON.stringify(packageItinerary));
      submissionData.append('hotel_activities', JSON.stringify(hotel_activities));  
      submissionData.append('packages_include', JSON.stringify(packagesInclude));
      submissionData.append('packages_exclude', JSON.stringify(packagesExclude));
      submissionData.append('file', file);
      submissionData.append('city_id', JSON.stringify(city_id));
      submissionData.append('sco_title', sco_title);
      submissionData.append('sco_description', sco_description);
      submissionData.append('isShow', isShow);
      submissionData.append('package_categories_id', JSON.stringify(package_categories_id));
      packages_galleries.forEach((file) => {
        submissionData.append('packages_galleries', file);
      });

      const res = await fetch('/api/v1/package/add', {
        method: 'POST',
        body: submissionData,
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Package added successfully!');
        router.push('/admin/packages');
      } else {
        toast.error(data.message || 'An error occurred.');
      }
      setIsLoading(false);
    });
  };

  return (
    <>
      <div className="package_category_outer">
        <div className="add-package-container">
          <h2>Add Package</h2>
          <form onSubmit={handleSubmit}>
            <InputGroup
              title={formData.title}
              slug={formData.slug}
              setFormData={setFormData}
            />

            <div className="form-group">
              <label htmlFor="title">Hotel Name</label>
              <input
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="package_price">Package Price</label>
              <input
                type="number"
                id="package_price"
                name="package_price"
                value={formData.package_price}
                onChange={handleChange}
                placeholder="Enter package price"
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
            <div className="form-group">
              <label htmlFor="package_days">Package Days</label>
              <select
                id="package_days"
                name="package_days"
                value={formData.package_days}
                onChange={handleChange}
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
              >
                {generateOptions(1, 100).map((night) => (
                  <option key={night} value={night}>{night}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="packageOverview">Package Overview</label>
              <textarea
                id="packageOverview"
                name="packageOverview"
                value={formData.packageOverview}
                onChange={handleChange}
                placeholder="Enter package overview"
              />
            </div>
            <div className="form-group">
              <label htmlFor="packageTopSummary">Package Top Summary</label>
              <textarea
                id="packageTopSummary"
                name="packageTopSummary"
                value={formData.packageTopSummary}
                onChange={handleChange}
                placeholder="Enter package top summary"
              />
            </div>
            <div className="form-group">
              <label>Categories</label>
              <Select
                isMulti
                options={categoryOptions}
                value={selectedCategories}
                onChange={handleCategoryChange}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select categories..."
              />
            </div>

            <div className="form-group">
              <label>Cities</label>
              <Select
                isMulti
                options={cityOptions}
                value={selectedCities}
                onChange={handleCityChange}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select cities..."
              />
            </div>
            <div className="form-group">
              <label>Package Itinerary</label>
              {formData.packageItinerary.map((item, index) => (
                <div key={index} className="itinerary-item">
                  <input
                    type="text"
                    name="day"
                    value={item.day}
                    onChange={(e) => handleDynamicChange(e, index, 'packageItinerary')}
                    placeholder="Day"
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
                  <textarea
                    name="itinerary_description"
                    value={item.itinerary_description}
                    onChange={(e) => handleDynamicChange(e, index, 'packageItinerary')}
                    placeholder="Itinerary Description"
                  />
                  <div className="remove_package" onClick={() => handleRemoveField(index, 'packageItinerary')}>
                    <FaMinus />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('packageItinerary')}>
                Add Itinerary
              </button>
            </div>
 
            <div className="form-group">
              <label>Hotel Activities</label>
              {formData.hotel_activities.map((item, index) => (
                <div key={index} className="activity-item">
                  <input
                    type="text"
                    name="hotel_name"
                    value={item.hotel_name}
                    onChange={(e) => handleDynamicChange(e, index, 'hotel_activities')}
                    placeholder="Hotel Name"
                  />
                  <textarea
                    name="activity_description"
                    value={item.activity_description}
                    onChange={(e) => handleDynamicChange(e, index, 'hotel_activities')}
                    placeholder="Activity Description"
                  />
                  <div className="remove_package" onClick={() => handleRemoveField(index, 'hotel_activities')}>
                    <FaMinus />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('hotel_activities')}>
                Add Activity
              </button>
            </div>
 
 
            <div className="form-group">
              <label>Packages Include</label>
              {formData.packagesInclude.map((item, index) => (
                <div key={index} className="include-item">
                  <textarea
                    name="description"
                    value={item.description}
                    onChange={(e) => handleDynamicChange(e, index, 'packagesInclude')}
                    placeholder="Description"
                  />
                  <div className="remove_package" onClick={() => handleRemoveField(index, 'packagesInclude')}>
                    <FaMinus />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('packagesInclude')}>
                Add Include
              </button>
            </div>
            <div className="form-group">
              <label>Packages Exclude</label>
              {formData.packagesExclude.map((item, index) => (
                <div key={index} className="exclude-item">
                  <textarea
                    name="description"
                    value={item.description}
                    onChange={(e) => handleDynamicChange(e, index, 'packagesExclude')}
                    placeholder="Description"
                  />
                  <div className="remove_package" onClick={() => handleRemoveField(index, 'packagesExclude')}>
                    <FaMinus />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('packagesExclude')}>
                Add Exclude
              </button>
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
            <div className="form-group">
              <label htmlFor="packages_galleries">Gallery Images</label>
              <input
                type="file"
                id="packages_galleries"
                name="packages_galleries"
                multiple
                onChange={(e) =>
                  setFormData((prevData) => ({ ...prevData, packages_galleries: [...e.target.files] }))
                }
              />
              {formData.packages_galleries.length > 0 && (
                <div className="gallery-preview">
                  {Array.from(formData.packages_galleries).map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="form-group handelCheckbox">
              <label>Do you want to enable this to be shown on the home page?</label>
              <input
                type="checkbox"
                name="isShow"
                checked={formData.isShow}
                onChange={handleChange}
              />
            </div>

            <div className="sco_panel">
              <h3>Add Package Seo meta keywords</h3>
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

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Add Package'}
            </button>
          </form>
        </div>
        <div className="package_categories">
          <PackageCategories />
        </div>
      </div>
    </>
  );
};

export default AddPackages;
