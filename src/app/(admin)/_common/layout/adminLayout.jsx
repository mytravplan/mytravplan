// /app/(admin)/_common/layout/adminLayout.jsx
'use client';
import React, { useState } from 'react';
import '../../Admin.css';
import AdminNavbar from '../header/components/navbar';
import Adminfooter from '../footer/components/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../sidebar/components/sidebar';

function AdminLayout({children}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className='admin_outer_layout'>
      <div className='sidebar_contexts'>
        <div className={`wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      </div>
      <div className='admin_contexts'>
      <AdminNavbar  toggleSidebar={toggleSidebar}/>
      <div className='admin_layout'>
      <ToastContainer style={{zIndex: '9999999999999999'}}/>
      {children}
      <Adminfooter/>
      </div>
      
      </div>
    </div>
  );
}

export default AdminLayout;
