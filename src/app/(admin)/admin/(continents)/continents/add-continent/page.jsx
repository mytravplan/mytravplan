// /app/(admin)/admin/(continents)/continents/add-continent/page.jsx

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import { InputGroup } from '@/hooks/slugUtils';

const AddContinent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { title, description, slug, file } = formData;

    if (!title || !description || !slug || !file) {
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

      const res = await fetch('/api/v1/continent/add', {
        method: 'POST',
        body: submissionData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Continent added successfully!');
        router.push('/admin/continents');
      } else {
        toast.error(data.message || 'An error occurred.');
      }

      setIsLoading(false);
    })


  };

  return (
    <div className="add-continent">
      <h2>Add Continent</h2>
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
          <label htmlFor="file">Image</label>
          <input type="file" id="file" name="file" onChange={handleChange} />
          {formData.file && (
            <div className="image-preview">
              <img src={URL.createObjectURL(formData.file)} alt="Preview" />
            </div>
          )}
        </div>
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Add Continent'}
        </button>
      </form>
    </div>
  );
};

export default AddContinent;



// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { handelAsyncErrors } from '@/helpers/asyncErrors';
// import { generateSlug } from '@/hooks/slugUtils';


// const AddContinent = () => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     slug: '',
//     file: null,
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prevData) => {
//       const updatedData = {
//         ...prevData,
//         [name]: files ? files[0] : value,
//       };

//       // Clear slug if title is cleared
//       if (name === 'title' && !value) {
//         updatedData.slug = '';
//       }

//       return updatedData;
//     });
//   };

//   const handleBlur = () => {
//     // Generate or update slug when title loses focus
//     if (formData.title) {
//       setFormData((prevData) => ({
//         ...prevData,
//         slug: generateSlug(prevData.title),
//       }));
//     } else {
//       // Clear slug if title is empty
//       setFormData((prevData) => ({
//         ...prevData,
//         slug: '',
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const { title, description, slug, file } = formData;

//     if (!title || !description || !slug || !file) {
//       toast.error('Please fill in all fields and upload an image.');
//       setIsLoading(false);
//       return;
//     }

//     return handelAsyncErrors(async () => {
//       const submissionData = new FormData();
//       submissionData.append('title', title);
//       submissionData.append('description', description);
//       submissionData.append('slug', slug);
//       submissionData.append('file', file);

//       const res = await fetch('/api/v1/continent/add', {
//         method: 'POST',
//         body: submissionData,
//       });

//       const data = await res.json();

//       if (data.success) {
//         toast.success(data.message || 'Continent added successfully!');
//         router.push('/admin/continents');
//       } else {
//         toast.error(data.message || 'An error occurred.');
//       }

//       setIsLoading(false);
//     });
//   };

//   return (
//     <div className="add-continent">
//       <h2>Add Continent</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">Title</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             onBlur={handleBlur} // Trigger slug generation or update on blur
//             placeholder="Enter title"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Enter description"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="slug">Slug</label>
//           <input
//             type="text"
//             id="slug"
//             name="slug"
//             value={formData.slug}
//             onChange={handleChange} // Allow manual input for slug
//             placeholder="Enter or auto-generate slug"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="file">Image</label>
//           <input type="file" id="file" name="file" onChange={handleChange} />
//           {formData.file && (
//             <div className="image-preview">
//               <img src={URL.createObjectURL(formData.file)} alt="Preview" />
//             </div>
//           )}
//         </div>
//         <button type="submit" className="button" disabled={isLoading}>
//           {isLoading ? 'Loading...' : 'Add Continent'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddContinent;
