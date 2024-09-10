// /app/(admin)/admin/(blog)/blog/create-blog/page.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { FaMinus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import CategoryManagement from '../../category-management/page';
import { InputGroup } from '@/hooks/slugUtils';

const CreateBlog = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    blog_category: '',
    blog_overview: '',
    blog_description: [{ content: '' }],
    file: null,
    gallery_files: []
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    return handelAsyncErrors(async () => {
      const res = await fetch('/api/v1/categories/get?page=1&limit=1000');
      const data = await res.json();
      if (data.success) {
        setCategories(data.result);
      } else {
        toast.error(data.message);
      }
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
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
      [field]: [...prevData[field], { content: '' }]
    }));
  };

  const handleRemoveField = (index, field) => {
    setFormData((prevData) => {
      const updatedField = [...prevData[field]];
      updatedField.splice(index, 1);
      return { ...prevData, [field]: updatedField };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const {
      title,
      description,
      slug,
      blog_category,
      blog_overview,
      blog_description,
      file,
      gallery_files
    } = formData;

    if (!title || !description || !slug || !file || !blog_category) {
      toast.error('Please fill in all required fields and upload an image.');
      setIsLoading(false);
      return;
    }

    return handelAsyncErrors(async () => {
      const submissionData = new FormData();
      submissionData.append('title', title);
      submissionData.append('description', description);
      submissionData.append('slug', slug);
      submissionData.append('blog_category', blog_category);
      submissionData.append('blog_overview', blog_overview);
      submissionData.append('blog_description', JSON.stringify(blog_description));
      submissionData.append('file', file);
      gallery_files.forEach((file) => {
        submissionData.append('gallery_files', file);
      });

      const res = await fetch('/api/v1/blog/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        router.push('/admin/blog');
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    });
  };

  return (
    <>
      <h2>Create Blog</h2>
      <div className="blog_cat_wrapper">
        <div className="add_blog">
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
              <label htmlFor="blog_category">Category</label>
              <select
                id="blog_category"
                name="blog_category"
                value={formData.blog_category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="blog_overview">Blog Overview</label>
              <textarea
                id="blog_overview"
                name="blog_overview"
                value={formData.blog_overview}
                onChange={handleChange}
                placeholder="Enter blog overview"
              />
            </div>
            <div className="form-group">
              <label>Blog Description</label>
              {formData.blog_description.map((item, index) => (
                <div key={index} className="description-item">
                  <textarea
                    name="content"
                    value={item.content}
                    onChange={(e) => handleDynamicChange(e, index, 'blog_description')}
                    placeholder="Description content"
                  />
                  <div className="remove-field" onClick={() => handleRemoveField(index, 'blog_description')}>
                    <FaMinus />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('blog_description')}>Add Description</button>
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
              <label htmlFor="gallery_files">Gallery Images</label>
              <input
                type="file"
                id="gallery_files"
                name="gallery_files"
                multiple
                onChange={(e) => setFormData((prevData) => ({ ...prevData, gallery_files: [...e.target.files] }))}
              />
              {formData.gallery_files.length > 0 && (
                <div className="gallery-preview">
                  {Array.from(formData.gallery_files).map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Create Blog'}
            </button>
          </form>
        </div>
        <div className="add_cats">
          <CategoryManagement />
        </div>

      </div>
    </>
  );
};

export default CreateBlog;
