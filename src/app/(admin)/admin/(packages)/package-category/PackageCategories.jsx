
// /app/(admin)/admin/(packages)/package-category/PackageCategories.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { handelAsyncErrors } from '@/helpers/asyncErrors';

function PackageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', image: null });
  const [editCategory, setEditCategory] = useState({ id: '', name: '', slug: '', image: null });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [message, setMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState({ add: false, update: false, delete: false });
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    return handelAsyncErrors(async () => {
      const response = await fetch('/api/v1/package-categories/get?page=1&limit=1000');
      const data = await response.json();
      setCategories(data.result);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNewCategoryChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewCategory(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setNewCategory(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditCategoryChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setEditCategory(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setEditCategory(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoadingButton(prev => ({ ...prev, add: true }));

    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('slug', newCategory.slug);
    if (newCategory.image) formData.append('image', newCategory.image);

    return handelAsyncErrors(async () => {
      const response = await fetch('/api/v1/package-category/add', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setMessage(result.message);
      setIsErrorMessage(false);
      if (result.success) {
        setCategories(prev => [...prev, result.result]);
        setNewCategory({ name: '', slug: '', image: null });
        setShowAddCategory(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
      setLoadingButton(prev => ({ ...prev, add: false }));
    });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoadingButton(prev => ({ ...prev, update: true }));

    const formData = new FormData();
    formData.append('name', editCategory.name);
    formData.append('slug', editCategory.slug);
    if (editCategory.image) formData.append('image', editCategory.image);

    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/package-category/update/${editCategory.id}`, {
        method: 'PUT',
        body: formData,
      });
      const result = await response.json();
      setMessage(result.message);
      setIsErrorMessage(false);
      if (result.success) {
        setCategories(prev => prev.map(cat => cat._id === editCategory.id ? result.result : cat));
        setEditCategory({ id: '', name: '', slug: '', image: null });
        setShowEditCategory(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
      setLoadingButton(prev => ({ ...prev, update: false }));
    });
  };

  const handleDeleteCategory = async (id) => {
    setLoadingButton(prev => ({ ...prev, delete: true }));

    return handelAsyncErrors(async () => {
      const response = await fetch(`/api/v1/package-category/delete/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      setMessage(result.message);
      setIsErrorMessage(result.message.includes('Category cannot be deleted'));
      if (result.success) {
        setCategories(prev => prev.filter(cat => cat._id !== id));
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
      setLoadingButton(prev => ({ ...prev, delete: false }));
    });
  };

  const handleToggleShowMore = () => {
    setShowAll(!showAll);
    setVisibleCount(showAll ? 6 : categories.length);
  };

  return (
    <div className="package-category-management">
      <h2>Package Category Management</h2>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <ul className="category-list">
          {categories.length === 0 ? (
            <li>No categories available</li>
          ) : (
            categories.slice(0, visibleCount).map(category => (
              <li key={category._id}>
                <div className="category-details" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={`/uploads/${category.image[0]?.name}`} alt={category.name} style={{ width: '40px', height: '40px', borderRadius: '50px', objectFit: 'cover' }} />
                  <span>{category.name} ({category.slug})</span>
                </div>
                <div className="category-actions">
                  <FaEdit onClick={() => {
                    setEditCategory({ id: category._id, name: category.name, slug: category.slug, image: null });
                    setShowEditCategory(true);
                  }} />
                  <FaTrash onClick={() => handleDeleteCategory(category._id)} />
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {categories.length > 6 && (
        <button onClick={handleToggleShowMore} className="btn">
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}

      <div className="add-category">
        {showAddCategory ? (
          <FaMinus className="toggle-icon" onClick={() => setShowAddCategory(false)} />
        ) : (
          <FaPlus className="toggle-icon" onClick={() => setShowAddCategory(true)} />
        )}
        <div className="tooltip">Add Category</div>
      </div>

      {showAddCategory && (
        <form onSubmit={handleAddCategory} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={newCategory.name} onChange={handleNewCategoryChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="slug">Slug:</label>
            <input type="text" id="slug" name="slug" value={newCategory.slug} onChange={handleNewCategoryChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input type="file" id="image" name="image" onChange={handleNewCategoryChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={loadingButton.add}>
              {loadingButton.add ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      )}

      {showEditCategory && (
        <form onSubmit={handleUpdateCategory} className="category-form">
          <div className="form-group">
            <label htmlFor="edit-id">Category ID:</label>
            <input type="text" id="edit-id" name="id" value={editCategory.id} onChange={handleEditCategoryChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="edit-name">Name:</label>
            <input type="text" id="edit-name" name="name" value={editCategory.name} onChange={handleEditCategoryChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="edit-slug">Slug:</label>
            <input type="text" id="edit-slug" name="slug" value={editCategory.slug} onChange={handleEditCategoryChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="edit-image">Image:</label>
            <input type="file" id="edit-image" name="image" onChange={handleEditCategoryChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={loadingButton.update}>
              {loadingButton.update ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      )}

      {message && (
        <div className={`message ${isErrorMessage ? 'red_message' : ''}`}>
          <span>{message}</span>
          <FaTimes className="close-icon" onClick={() => setMessage('')} />
        </div>
      )}
    </div>
  );
}

export default PackageCategories;
