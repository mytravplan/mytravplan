'use client';

import React, { useEffect, useState } from 'react';

function Page() {
  const [data, setData] = useState({ result: [] }); // Initialize with a default structure

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch('/api/v1/privacy-policy/get');
        const result = await response.json();

        if (response.ok) {
          setData(result);
          console.log(result);
        } else {
          console.error('Error fetching privacy policy:', result.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchPrivacyPolicy();
  }, []);


  const sections = data.result.length > 0 ? data.result[0].sections : [];

  return (
    <div className="privacy_outer">
      <div className="privacy_inner">
        <div className="privacy_wrapper">
          {sections?.map((section) => (
            <div key={section._id}>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
