// // utils/slugUtils.js

// /**
//  * Generate a slug from a given title.
//  * @param {string} title - The title to generate the slug from.
//  * @returns {string} - The generated slug.
//  */
// export const generateSlug = (title) => {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, '-') // Replace spaces with hyphens
//     .replace(/[^a-z0-9-]/g, ''); // Remove non-alphanumeric characters except hyphens
// };




// utils/slugUtils.js

import React from 'react';

/**
 * Generate a slug from a given title.
 * @param {string} title - The title to generate the slug from.
 * @returns {string} - The generated slug.
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ''); // Remove non-alphanumeric characters except hyphens
};

/**
 * InputGroup Component to render title and slug inputs.
 * @param {Object} props - The props for the component.
 * @param {string} props.title - The current title value.
 * @param {string} props.slug - The current slug value.
 * @param {Function} props.setFormData - The function to update form data.
 * @returns {JSX.Element} - The rendered component.
 */
export const InputGroup = ({ title, slug, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: files ? files[0] : value,
      };

      // Clear slug if title is cleared
      if (name === 'title' && !value) {
        updatedData.slug = '';
      }

      return updatedData;
    });
  };

  const handleBlur = () => {
    if (title) {
      setFormData((prevData) => ({
        ...prevData,
        slug: generateSlug(title),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        slug: '',
      }));
    }
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleChange}
          onBlur={handleBlur} // Trigger slug generation or update on blur
          placeholder="Enter title"
        />
      </div>
      <div className="form-group">
        <label htmlFor="slug">Slug</label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={handleChange} // Allow manual input for slug
          placeholder="Enter or auto-generate slug"
        />
      </div>
    </div>
  );
};
