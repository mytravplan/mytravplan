// /app/(admin)/admin/(footer)/footer/page.jsx

'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';

function FooterPage() {
  const [footerData, setFooterData] = useState({
    phoneNumbers: [],
    emailAddresses: [],
    address: '',
    socialIcons: [],
  });

  const [footerId, setFooterId] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to handle form visibility

  // Fetch the footer data when the component mounts
  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/v1/footer-details/get');
      const data = await response.json();
      if (response.ok) {
        const result = data.result[0];
        setFooterData({
          phoneNumbers: result.phoneNumbers,
          emailAddresses: result.emailAddresses,
          address: result.address,
          socialIcons: result.socialIcons,
        });
        setFooterId(result._id); // Set the ID for updating
      } else {
        console.error('Error fetching footer data:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  // Handle input change for fields
  const handleInputChange = (e, index, field, type) => {
    const { name, value } = e.target;

    setFooterData((prevData) => {
      if (type === 'array') {
        const updatedArray = [...prevData[field]];
        updatedArray[index] = value;
        return { ...prevData, [field]: updatedArray };
      } else if (type === 'object') {
        const updatedObjects = [...prevData[field]];
        updatedObjects[index][name] = value;
        return { ...prevData, [field]: updatedObjects };
      } else {
        return { ...prevData, [name]: value };
      }
    });
  };

  // Handle adding new fields
  const addField = (field, type) => {
    setFooterData((prevData) => {
      if (type === 'array') {
        return { ...prevData, [field]: [...prevData[field], ''] };
      } else if (type === 'object') {
        return { ...prevData, [field]: [...prevData[field], { name: '', url: '', iconUrl: '' }] };
      }
    });
  };

  // Handle removing fields
  const removeField = (field, index, type) => {
    setFooterData((prevData) => {
      if (type === 'array') {
        return { ...prevData, [field]: prevData[field].filter((_, i) => i !== index) };
      } else if (type === 'object') {
        return { ...prevData, [field]: prevData[field].filter((_, i) => i !== index) };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!footerData) {
      if (!footerData.address) {
        toast.error('fill address field');
      } if (footerData.phoneNumbers) {
        toast.error('fill phone number field');
      } if (footerData.emailAddresses) {
        toast.error('fill email field');
      } if (footerData.socialIcons) {
        toast.error('add icons,name,url');
      }
      return;
    }

    try {
      const response = await fetch(`/api/v1/footer-details/update/${footerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: footerData.address,
          phoneNumbers: footerData.phoneNumbers,
          emailAddresses: footerData.emailAddresses,
          socialIcons: footerData.socialIcons,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result);
        toast.success(result.message); // Set success state
        setIsEditing(false); // Hide form after successful update

        fetchFooterData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error:', error);
    }
  };


  const cancelUpdate = () => {
    fetchFooterData();
    setIsEditing(false);
  }


  return (
    <div className='footer_data'>

      <div className="footer_content_wrapper">
        <div className="display_footer_data">
          <h1>Footer Page</h1>
          <div>
            <strong>Address:</strong>
            <p>{footerData.address}</p>
          </div>

          <div>
            <h3>Phone Numbers:</h3>
            <ul>
              {footerData.phoneNumbers.map((phone, index) => (
                <li key={index}>{phone}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Email Addresses:</h3>
            <ul>
              {footerData.emailAddresses.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Social Icons:</h3>
            <ul>
              {footerData.socialIcons.map((icon, index) => (
                <li key={index}>
                  <Link href={icon.url} target="_blank" rel="noopener noreferrer">
                    <img src={icon.iconUrl} alt={icon.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                    {icon.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Update Content Button */}
          {!isEditing && <button onClick={() => setIsEditing(true)}>Update Content</button>}
        </div>

        {/* Update Content Form */}
        {isEditing && (
          <div className="update_footer_data">
            <form onSubmit={handleSubmit}>
              <div>
                <h2>Address:</h2>
                <textarea 
                name="address" 
                id="address" 
                value={footerData.address}
                onChange={(e) => handleInputChange(e, null, 'address')}></textarea>
              </div>

              <div>
                <h2>Phone Numbers:</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Phone Number</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {footerData.phoneNumbers.map((phone, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => handleInputChange(e, index, 'phoneNumbers', 'array')}
                          />
                        </td>
                        <td>
                          <FaMinus className="toggle-icon" onClick={() => removeField('phoneNumbers', index, 'array')} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <FaPlus className="toggle-icon" onClick={() => addField('phoneNumbers', 'array')} />
              </div>

              <div>
                <h2>Email Addresses:</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Email Address</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {footerData.emailAddresses.map((email, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleInputChange(e, index, 'emailAddresses', 'array')}
                          />
                        </td>
                        <td>
                          <FaMinus className="toggle-icon" onClick={() => removeField('emailAddresses', index, 'array')} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <FaPlus className="toggle-icon" onClick={() => addField('emailAddresses', 'array')} />
              </div>

              <div>
                <h2>Social Icons:</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Handle Icon Name</th>
                      <th>Handle URL</th>
                      <th>Handle Icon URL</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {footerData.socialIcons.map((icon, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            name="name"
                            placeholder="Icon Name"
                            value={icon.name}
                            onChange={(e) => handleInputChange(e, index, 'socialIcons', 'object')}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="url"
                            placeholder="Link URL"
                            value={icon.url}
                            onChange={(e) => handleInputChange(e, index, 'socialIcons', 'object')}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="iconUrl"
                            placeholder="Icon Image URL"
                            value={icon.iconUrl}
                            onChange={(e) => handleInputChange(e, index, 'socialIcons', 'object')}
                          />
                        </td>
                        <td>
                          <FaMinus className="toggle-icon" onClick={() => removeField('socialIcons', index, 'object')} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <FaPlus className="toggle-icon" onClick={() => addField('socialIcons', 'object')} />
              </div>

              <button type="submit">Update Content</button>
              <button className='cancel_update' onClick={cancelUpdate}>Cancel</button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}

export default FooterPage;
