'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function PrivacyPolicyPage() {
  const [privacyPolicies, setPrivacyPolicies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState(null); // Store the current policy being edited

  // Fetch existing privacy policies from the API
  const fetchPrivacyPolicies = async () => {
    try {
      const response = await fetch('/api/v1/privacy-policy');
      const data = await response.json();
      if (data.status === 200) {
        setPrivacyPolicies(data.result);
      } else {
        toast.error('Failed to fetch privacy policies');
      }
    } catch (error) {
      console.error('Error fetching privacy policies:', error);
      toast.error('Error fetching privacy policies');
    }
  };

  useEffect(() => {
    fetchPrivacyPolicies(); // Fetch policies when the component mounts
  }, []);

  // Handle update policy
  const updatePolicy = async () => {
    if (!currentPolicy) return;

    try {
      const response = await fetch(`/api/v1/privacy-policy/${currentPolicy._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacydata: currentPolicy.privacydata }),
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success(data.message);
        setIsEditing(false);
        fetchPrivacyPolicies(); // Refresh the list
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update policy');
    }
  };

  // Handle delete policy
  const deletePolicy = async (id) => {
    try {
      const response = await fetch(`/api/v1/privacy-policy/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.status === 200) {
        toast.success(data.message);
        fetchPrivacyPolicies(); // Refresh the list
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete policy');
    }
  };

  // Add a new privacydata entry
  const addPrivacyData = () => {
    setCurrentPolicy((prev) => {
      const updatedPolicy = { ...prev };
      updatedPolicy.privacydata = [
        ...updatedPolicy.privacydata,
        { title: '', description: '' }, // Add a new entry
      ];
      return updatedPolicy;
    });
  };

  // Remove a specific privacydata entry by index
  const deletePrivacyData = (index) => {
    setCurrentPolicy((prev) => {
      const updatedPolicy = { ...prev };
      updatedPolicy.privacydata.splice(index, 1); // Remove the entry at the given index
      return updatedPolicy;
    });
  };

  return (
    <div className="privacy-policy-page">
      <h1>Privacy Policies</h1>

      {/* Display Privacy Policies */}
      <div>
        {privacyPolicies.length > 0 ? (
          privacyPolicies.map((policy) => (
            <div key={policy._id} className="policy">
              <h3>Privacy Policy Details</h3>
              {policy.privacydata.length > 0 ? (
                policy.privacydata.map((dataItem, index) => (
                  <div key={dataItem._id}>
                    <h4>Title: {dataItem.title}</h4>
                    <p>Description: {dataItem.description}</p>
                  </div>
                ))
              ) : (
                <p>No privacy data available</p>
              )}
              {/* Show the edit button even if there is no privacy data */}
              <button onClick={() => { setCurrentPolicy(policy); setIsEditing(true); }}>
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No privacy policies available.</p>
        )}
      </div>

      {/* Edit Policy Form */}
      {isEditing && currentPolicy && (
        <div className="edit-policy-form">
          <h2>Edit Policy</h2>

          {/* Show a message if privacydata is empty */}
          {currentPolicy.privacydata.length === 0 ? (
            <p>No privacy data found. You can add new entries.</p>
          ) : (
            currentPolicy.privacydata.map((dataItem, index) => (
              <div key={dataItem._id}>
                <input
                  type="text"
                  value={dataItem.title}
                  onChange={(e) =>
                    setCurrentPolicy((prev) => {
                      const updatedData = [...prev.privacydata];
                      updatedData[index].title = e.target.value;
                      return { ...prev, privacydata: updatedData };
                    })
                  }
                  placeholder="Title"
                />
                <textarea
                  value={dataItem.description}
                  onChange={(e) =>
                    setCurrentPolicy((prev) => {
                      const updatedData = [...prev.privacydata];
                      updatedData[index].description = e.target.value;
                      return { ...prev, privacydata: updatedData };
                    })
                  }
                  placeholder="Description"
                />
                <button onClick={() => deletePrivacyData(index)}>Delete</button>
              </div>
            ))
          )}

          {/* Add a new privacy data entry */}
          <button onClick={addPrivacyData}>Add Privacy Data</button>

          <button onClick={updatePolicy}>Save Changes</button>
        </div>
      )}
    </div>
  );
}

export default PrivacyPolicyPage;
