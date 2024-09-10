// /app/(admin)/_common/header/components/admin_navbar.jsx  

'use client';
import React, { useState } from 'react';
import { FaBars, FaBell, FaGlobe, FaSearch } from 'react-icons/fa';
import './navbar.css'; // Import the global CSS
import logo from '../../../../assets/home_images/logo.png';
import Link from 'next/link';
import LogoutPage from '@/app/_common/_logout/logoutPage';
import { useSession } from 'next-auth/react';

function AdminNavbar({ toggleSidebar }) {

  const { data: session } = useSession();

  const [popupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  // Get the first letter of the admin's name
  const firstLetter = session?.user?.email ? session.user.email.charAt(0).toUpperCase() : '';

  return (

      <div className="admin_navbar">
        <div className="admin_navbar_inner">
          <div className="admin_navbar-left">

            <button className="toggle-button" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <div className="logo">
              <Link href={`/admin/dashboard`}>
                <img src={logo.src} alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="admin_navbar-center">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
            />
          </div>
          <div className="admin_navbar-right">
            <div className="notification-button">
              <Link href={`/admin/notifications`}>
                <FaBell className="icon" />
                <span className="notification-badge"></span>
              </Link>
            </div>
            <FaGlobe className="icon" />
            <div className="profile-container">
              
              {session ? (<div className="icon-container profile-photo" onClick={togglePopup}>
                <h2>{firstLetter}</h2>
              </div>) : (
                <img
                  src="https://via.placeholder.com/40" // Placeholder profile photo
                  alt="Profile"
                  className="profile-photo"
                  onClick={togglePopup}
                />
              )}

              {popupVisible && (
                <div className="profile-popup">
                  <ul>
                    <li><Link href="/admin/profile">View Profile</Link></li>
                    <li><Link href="/admin/settings">Settings</Link></li>
                    <li> <LogoutPage role='admin' /> </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default AdminNavbar;
