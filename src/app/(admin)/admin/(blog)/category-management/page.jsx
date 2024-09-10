// // /app/(admin)/admin/category-management/page.jsx

'use client';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [editCategory, setEditCategory] = useState({ id: '', name: '', slug: '' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState({ add: false, update: false, delete: false });

  // New state to manage the visible categories
  const [visibleCount, setVisibleCount] = useState(6);
  const [showAll, setShowAll] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    return handelAsyncErrors(async()=>{
      const response = await fetch('/api/v1/categories/get?page=1&limit=1000');
      const data = await response.json();
      setCategories(data.result);
      setLoading(false);
    })
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCategoryChange = (e) => {
    const { name, value } = e.target;
    setEditCategory(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoadingButton(prev => ({ ...prev, add: true }));
    
    return handelAsyncErrors(async()=>{
      const response = await fetch('/api/v1/category/add', {
        method: 'POST',
        body: JSON.stringify(newCategory),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setMessage(result.message);
      if (result.success) {
        setCategories(prev => [...prev, result.result]);
        setNewCategory({ name: '', slug: '' });
        setShowAddCategory(false);
        setTimeout(() => {
          setMessage(false);
        }, 4000);
      }
      setLoadingButton(prev => ({ ...prev, add: false }));
    })
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoadingButton(prev => ({ ...prev, update: true }));

    return handelAsyncErrors(async()=>{
      const response = await fetch(`/api/v1/category/update/${editCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify(editCategory),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setMessage(result.message);
      if (result.success) {
        setCategories(prev => prev.map(cat => cat._id === editCategory.id ? result.result : cat));
        setEditCategory({ id: '', name: '', slug: '' });
        setShowEditCategory(false);
        setTimeout(() => {
          setMessage(false);
        }, 4000);
      }
      setLoadingButton(prev => ({ ...prev, update: false }));
    })
  };

  const handleDeleteCategory = async (id) => {
    setLoadingButton(prev => ({ ...prev, delete: true }));

    return handelAsyncErrors(async()=>{
      const response = await fetch(`/api/v1/category/delete/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      setMessage(result.message);
      if (result.success) {
        setCategories(prev => prev.filter(cat => cat._id !== id));
        setTimeout(() => {
          setMessage(false);
        }, 4000);
      }
      setLoadingButton(prev => ({ ...prev, delete: false }));
    })
      
  };

  // Handle toggle between showing more and less categories
  const handleToggleShowMore = () => {
    setShowAll(!showAll);
    setVisibleCount(showAll ? 6 : categories.length);
  };

  return (
    <div className="category-management">
      <h2>Category Management</h2>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <ul className="category-list">
          {categories.length === 0 ? (
            <li>No categories available</li>
          ) : (
            categories.slice(0, visibleCount).map(category => (
              <li key={category._id}>
                {category.name} ({category.slug})
                <div className="category-actions">
                  <FaEdit onClick={() => {
                    setEditCategory({ id: category._id, name: category.name, slug: category.slug });
                    setShowEditCategory(true);
                  }} />
                  <FaTrash onClick={() => handleDeleteCategory(category._id)} />
                </div>
              </li>
            ))
          )}
        </ul>
      )}


      {/* Show more or less button */}
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
          <div className="form-actions">
            <button type="submit" className="btn" disabled={loadingButton.update}>
              {loadingButton.update ? 'Updating...' : 'Update Category'}
            </button>
            <FaTimes className="cancel-icon" onClick={() => setShowEditCategory(false)} />
          </div>
        </form>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CategoryManagement;
