//  /app/not-found.js

'use client';
import React from 'react';
import Link from 'next/link';
import { FaPlane, FaHome } from 'react-icons/fa';
import Layout from './_common/layout/layout';
import notfound_airplane from './assets/home_images/notfound-airplane.png';

const NotFound = () => {
  return (
    <Layout>
      <div className="notfound-page">
        <div className="notfound-container">
          <FaPlane size={60} className="notfound-icon" />
          <h1 className="notfound-title">Oops!</h1>
          <h2 className="notfound-subtitle">404 - Page Not Found</h2>
          <p className="notfound-text">
            Looks like you’ve taken a detour! This page seems to be lost in the clouds. 
            Double-check the URL or return to our home base.
          </p>
          <Link href="/" className="notfound-home-link">
            <FaHome size={18} />
            Head Back Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
