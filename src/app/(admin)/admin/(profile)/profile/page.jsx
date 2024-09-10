// /app/(admin)/admin/(profile)/profile/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaUserCircle, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';

function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true); // Main loading state
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  useEffect(() => {
    if (session?.user) {
      const { registerusername, email, phoneNumber, password } = session.user;
      setProfile({
        name: registerusername || '',
        email: email || '',
        phoneNumber: phoneNumber || '',
        password: password || ''
      });
      setLoading(false); 
    } else {
      setLoading(false); 
    }
  }, [session]);

  if (loading) {
    return <LoadingBar/>; 
  }

  return (
    <>
      <Breadcrumb path="/admin/profile" />
      <div className="profile-page">
        <h1>Admin Profile</h1>
        <div className="profile-details">
          <div className="profile-item">
            {profile.name && (
              <span>
                <FaUserCircle size={24} /><strong>Name:</strong> {profile.name}
              </span>
            )}
          </div>
          <div className="profile-item">
            {profile.email && (
              <span>
                <FaEnvelope size={24} /><strong>Email:</strong> {profile.email}
              </span>
            )}
          </div>
          <div className="profile-item">
            {profile.phoneNumber && (
              <span>
                <FaPhone size={24} /><strong>Phone Number:</strong> {profile.phoneNumber}
              </span>
            )}
          </div>
          {profile.password && (
            <div className="profile-item">
              <span>
                <FaEye size={24} /><strong>Password:</strong>
                <span className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={profile.password}
                    readOnly // Ensure the password field is read-only
                  />
                  <span onClick={togglePasswordVisibility} className="password-toggle">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
