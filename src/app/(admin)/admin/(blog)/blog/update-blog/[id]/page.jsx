// /app/(admin)/admin/(blog)/blog/update-blog/[id]/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';

function UpdateBlog({ params }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    blog_category: '',
    blog_overview: '',
    blog_description: [{ content: '' }],
    images: [],
    imageFile: null,
    imagePreviewUrl: '',
    blog_galleries: [],
    gallery_files: null,
    galleryPreviewUrls: [],
  });
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchCategories = async () => {
      return handelAsyncErrors(async () => {
        const res = await fetch('/api/v1/categories/get?page=1&limit=1000', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await res.json();
        if (data.success) {
          setCategories(data.result);
        } else {
          toast.error(data.message);
        }
      });
    };

    const fetchBlog = async () => {
      return handelAsyncErrors(async () => {
        const response = await fetch(`/api/v1/blog/getbyid/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
          setFormData({
            ...data.result,
            gallery_files: [],
            galleryPreviewUrls: [],
            blog_description: data.result.blog_description.map(desc => ({ content: desc.content })),
            blog_category: data.result.category?._id || '',
            imageFile: null,
          });
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      });
    };

    fetchCategories();
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          imageFile: file,
          imagePreviewUrl: reader.result
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (name === 'gallery_files') {
      const galleryFiles = Array.from(files);
      const galleryPreviews = galleryFiles.map(file => URL.createObjectURL(file)); // Create previews

      setFormData((prevData) => ({
        ...prevData,
        gallery_files: galleryFiles,
        galleryPreviewUrls: galleryPreviews,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDynamicChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const updatedDescription = [...prevData.blog_description];
      updatedDescription[index][name] = value;
      return { ...prevData, blog_description: updatedDescription };
    });
  };

  const handleAddField = () => {
    setFormData(prevData => ({
      ...prevData,
      blog_description: [...prevData.blog_description, { content: '' }]
    }));
  };

  const handleRemoveField = (index) => {
    setFormData(prevData => {
      const updatedDescription = [...prevData.blog_description];
      updatedDescription.splice(index, 1);
      return { ...prevData, blog_description: updatedDescription };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('blog_category', formData.blog_category);
    formDataToSend.append('blog_overview', formData.blog_overview);
    formDataToSend.append('blog_description', JSON.stringify(formData.blog_description));

    if (formData.imageFile) {
      formDataToSend.append('file', formData.imageFile);
    }

    formData.gallery_files.forEach((file, index) => {
      formDataToSend.append('blog_galleries', file);
    });

    try {
      const response = await fetch(`/api/v1/blog/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => router.push('/admin/blog'), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred while updating the blog.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="update-packages-container">
      <h2 className="update-packages-heading">Update Blog</h2>
      {loading && <p className="update-packages-loading">Loading...</p>}

      <form className="update-packages-form" onSubmit={handleSubmit}>
        <label className="update-packages-label">
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
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
            value={formData.slug}
            onChange={handleChange}
            className="update-packages-input"
            required
          />
        </label>
        <label className="update-packages-label">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="update-packages-textarea"
            required
          />
        </label>
        <div className="form-group">
          <label htmlFor="continent">Blog Category</label>
          <select
            id="categories"
            name="blog_category"
            value={formData.blog_category}
            onChange={handleChange}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="update-blog-label">
            Blog Overview:
            <textarea
              name="blog_overview"
              value={formData.blog_overview}
              onChange={handleChange}
              className="update-blog-textarea"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label className="update-packages-label">Blog Description</label>
          {formData.blog_description.map((item, index) => (
            <div key={index} className="description-item">
              <textarea
                name="content"
                value={item.content}
                onChange={(e) => handleDynamicChange(e, index)}
                placeholder="Description content"
              />
              <div className="remove-field" onClick={() => handleRemoveField(index)}>
                <FaMinus />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddField}>Add Description</button>
        </div>
        <div className="form-group">
          <label className="update-blog-label">
            Main Image:
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              className="update-blog-file-input"
            />
            <div className="update-blog-image-preview">
              {formData.imagePreviewUrl ? (
                <img
                  src={formData.imagePreviewUrl}
                  alt="New"
                  className="update-packages-image"
                  style={{ width: '100px', height: '100px' }}
                />
              ) : (
                formData.images.map((image, index) => (
                  <img
                    key={index}
                    src={`/uploads/${image.name}`}
                    alt={`Current ${image.name}`}
                    className="update-packages-image"
                    style={{ width: '100px', height: '100px' }}
                  />
                ))
              )}
            </div>
          </label>
        </div>
        <div className="form-group">
          <label className="update-blog-label">
            Gallery Images:
            <input
              type="file"
              name="gallery_files"
              multiple
              onChange={handleChange}
              className="update-blog-file-input"
            />
            <div className="update-blog-gallery-preview">
              
               {formData.galleryPreviewUrls.length > 0 ? (
                formData.galleryPreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Gallery Preview ${index}`}
                    className="update-packages-gallery-image"
                    style={{width: '100px',height:'100px'}}
                  />
                ))
              ) : (
                formData.blog_galleries.map((file, index) => (
                  <img
                    key={index}
                    src={`/uploads/${file.name}`}
                    alt={`Gallery Image ${index}`}
                    className="update-packages-gallery-image"
                    style={{width: '100px',height:'100px'}}
                  />
                ))
              )}
            </div>
          </label>
        </div>
        <button type="submit" className="update-packages-button" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update blog'}
        </button>
      </form>

    </div>
  );
}

export default UpdateBlog;
