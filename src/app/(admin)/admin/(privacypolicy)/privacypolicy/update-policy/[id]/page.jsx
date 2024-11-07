'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function EditPrivacyPolicy({ params }) {
  const [policies, setPolicies] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const router = useRouter();
  const { id } = params;  

  // Fetch existing policy data when the component is mounted or when `id` changes

  useEffect(() => {
    if (!id) return;  
    const fetchPolicyData = async () => {
      try {
        const response = await fetch(`/api/v1/privacy-policy/${id}`);
        const data = await response.json();

        if (data.status === 200) {
          setPolicies(data.result);  
        } else {
          toast.error('Failed to fetch policy data');
        }
      } catch (error) {
        toast.error('An error occurred while fetching policy data');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, [id]);

   const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newPolicies = [...policies];
    newPolicies[index][name] = value;
    setPolicies(newPolicies);
  };

   const handleAdd = () => {
    setPolicies([...policies, { title: '', description: '' }]);
  };

   const handleRemove = (index) => {
    const newPolicies = policies.filter((_, i) => i !== index);
    setPolicies(newPolicies);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all title and description fields are filled
    const isValid = policies.every((policy) => policy.title && policy.description);
    if (!isValid) {
      toast.error('Please fill out both title and description for all entries');
      return;
    }

    // Make the API call to update the policies (replace with your actual API call)
    try {
      const response = await fetch(`/api/v1/privacy-policy/${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policies }), 
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success('Policies updated successfully');
        router.push('/admin/privacy-policy'); 
      } else {
        toast.error('Failed to update policies');
      }
    } catch (error) {
      toast.error('An error occurred while updating policies');
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="edit-privacy-policy">
      <h1>Edit Privacy Policies</h1>
      <form onSubmit={handleSubmit}>
       
          <div   className="policy-form-row">
            <div>
              <label htmlFor={``}>Title</label>
              <input
                type="text"
            
                name="title"
                value={policies.title}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>
            <div>
              <label htmlFor={''}>Description</label>
              <textarea
              
                name="description"
                value={policies.description}
                onChange={(e) => handleChange(e, index)}
                required
              />
            </div>
            <button type="button" onClick={() => handleRemove(index)}>
              Remove
            </button>
          </div>
     
        <button type="button" onClick={handleAdd}>Add Another</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EditPrivacyPolicy;
