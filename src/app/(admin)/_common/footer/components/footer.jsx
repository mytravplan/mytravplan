// /app/(admin)/_common/header/components/footer.jsx  

'use client';
import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import Link from 'next/link'; // Import Link from next/link
import logo from '../../../../assets/home_images/logo.png'; // Import logo

import './footer.css'; // Import the global CSS

function AdminFooter() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-left">
        <Link href={`/admin/dashboard`}>
          <img src={logo.src} alt="Logo" className="footer-logo" />
          </Link>
          <p>© 2024 Admin Dashboard. All Rights Reserved.</p>
        </div>
        <div className="footer-center">
          <ul className="footer-links">
            <li><Link href="/admin/dashboard">Dashboard</Link></li>
            <li><Link href="/admin/users">Users</Link></li>
            <li><Link href="/admin/settings">Settings</Link></li>
            <li><Link href="/admin/reports">Reports</Link></li>
          </ul>
        </div>
        <div className="footer-right">
          <div className="admin_social-icons">
            <Link href="https://facebook.com" className="admin_social-icon" target="_blank" rel="noopener noreferrer"><FaFacebookF /></Link>
            <Link href="https://twitter.com" className="admin_social-icon" target="_blank" rel="noopener noreferrer"><FaTwitter /></Link>
            <Link href="https://linkedin.com" className="admin_social-icon" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></Link>
            <Link href="https://instagram.com" className="admin_social-icon" target="_blank" rel="noopener noreferrer"><FaInstagram /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFooter;
