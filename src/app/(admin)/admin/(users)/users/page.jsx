// /app/(admin)/admin/(users)/users/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function UsresPage() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage] = useState(PER_PAGE_LIMIT);
  const [searchQuery, setSearchQuery] = useState('');
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({
    registerusername: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '', // Add password field
  });

  const [showPasswordField, setShowPasswordField] = useState(false); // Track if password field should be shown

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};
  async function fetchContacts() {
    const response = await fetch(`/api/v1/otpuser/getallusers?page=${currentPage}&limit=${itemsPerPage}`);
    const data = await response.json();

    return handelAsyncErrors(async () => {
      if (response.ok && data.status === 200) {
        setContacts(data.users);
        setTotalResults(data.totalResult);
        setFilteredContacts(data.users);
      } else {
        toast.error(data.message || 'Failed to fetch Contacts');
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchContacts();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter(contact =>
        (contact.registerusername?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (contact.phoneNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchQuery]);

  const handleConfirm = async () => {
    const response = await fetch(`/api/v1/otpuser/delete/${deleteItem}`, { method: 'DELETE' });
    const data = await response.json();
    return handelAsyncErrors(async () => {
      if (response.ok && data.status === 200) {
        fetchContacts();
        toast.success(data.message || 'Contact deleted successfully');
        setIsOpen(false);
      } else {
        toast.error(data.message || 'Failed to delete contact');
      }
    });
  };

  const handleDelete = (id) => {
    setIsOpen(true);
    setDeleteItem(id);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (contact) => {
    setIsEditOpen(true);
    setEditItem(contact._id);
    setEditData({
      registerusername: contact.registerusername || '',
      email: contact.email || '',
      phoneNumber: contact.phoneNumber || '',
      role: contact.role || 'user',
      password: '', // Reset password field
    });

    setShowPasswordField(contact.role === 'user'); // Show password field only if role is 'user'
  };

  const handleEditSubmit = async () => {

    setLoading(true);
    const updateData = { ...editData };

    // If role is admin, remove the password field from the update data
    if (editData.role === 'admin') {
      delete updateData.password;
    }

    const response = await fetch(`/api/v1/otpuser/update/${editItem}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    const data = await response.json();

    return handelAsyncErrors(async () => {
      if (response.ok && data.status === 200) {
        fetchContacts();
        toast.success(data.message || 'Contact updated successfully');
        setIsEditOpen(false);
        setLoading(false);
      } else {
        toast.error(data.message || 'Failed to update contact');
      }
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-packages">
      <ModalWrapper
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />
      <div className="package_header">
        <Breadcrumb path="/admin/users" />
        <div className="search-users-input">
          <input
            type="text"
            placeholder="Search by Name, Email, or Phone Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


      {/* Edit Modal */}
      {isEditOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit User</h2>
            <label htmlFor="registerusername">Name:</label>
            <input
              type="text"
              name="registerusername"
              value={editData.registerusername}
              onChange={handleEditChange}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
            />
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={editData.phoneNumber}
              onChange={handleEditChange}
            />
            <label htmlFor="role">Role:</label>
            <select name="role" value={editData.role} onChange={handleEditChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {showPasswordField && (
              <> 
              <label htmlFor="password">Password:</label>
              <div className="password-wrapper">
              <input
                   type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={editData.password}
                  onChange={handleEditChange}
                />
                <span onClick={togglePasswordVisibility} className="password-toggle">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
              </div>
                
              </>
            )}
            <button onClick={handleEditSubmit} disabled={loading}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>

            <button onClick={() => setIsEditOpen(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}


      {error && <div className="error">{error}</div>}
      <div className="admin-packages-table-container">
        <table className="admin-packages-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">Loading...</td>
              </tr>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No Contacts Available</td>
              </tr>
            ) : (
              filteredContacts.map(contact => (
                <tr key={contact._id}>
                  <td data-label="ID">{contact._id}</td>
                  <td data-label="Name">{contact.registerusername || 'N/A'}</td> {/* Handle Null Values */}
                  <td data-label="Email">{contact.email || 'N/A'}</td> {/* Handle Null Values */}
                  <td data-label="Phone Number">{contact.phoneNumber || 'N/A'}</td> {/* Handle Null Values */}
                  <td data-label="Role">{contact.role}</td> {/* New Role Field */}
                  <td data-label="Actions">
                    <span className="actions">
                      <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(contact)} />
                      <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(contact._id)} />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          {'<<'}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          {'<'}
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          {'>'}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
}

export default UsresPage;
