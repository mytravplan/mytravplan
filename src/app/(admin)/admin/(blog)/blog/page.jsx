// /app/(admin)/admin/(blog)/blog/page.jsx

'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';



function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [itemsPerPage] = useState(PER_PAGE_LIMIT); // Number of items per page
    const totalPages = Math.ceil(totalResults / itemsPerPage); // Calculate total pages

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    async function fetchBlogs() {
        return handelAsyncErrors(async () => {
            const response = await fetch(`/api/v1/blogs/get?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json();
            if (data.success) {
                setBlogs(data.result);
                setTotalResults(data.totalResults); // Set totalResults from API
            }

            setLoading(false);
        })

    }
    useEffect(() => {
        fetchBlogs();
    }, [currentPage, itemsPerPage]);

    const handleAddClick = () => {
        router.push('/admin/blog/create-blog');
    };

    const openDeleteModal = (id) => {
        setIsOpen(true);
        setDeleteItem(id);
    };

    const confirmDelete = async () => {
        return handelAsyncErrors(async () => {
            const response = await fetch(`/api/v1/blog/delete/${deleteItem}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                fetchBlogs();
                toast.success('Blog deleted successfully');

            } else {
                toast.error('Failed to delete blog');
            }
            setIsOpen(false);
        })


    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEdit = (id) => {
        router.push(`/admin/blog/update-blog/${id}`);
    };

    const handlePreview = (id) => {
        router.push(`/admin/blog/preview-blog/${id}`);
    };

    return (
        <div className="admin-packages">
            <ModalWrapper
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={confirmDelete}
            />
            <div className="package_header">
                <Breadcrumb path="/admin/Blog" />
                <div className="floating-plus" onClick={handleAddClick}>
                    <FaPlus />
                    <div className="add_tooltip">Add Blog</div>
                </div>
            </div>

            {error && <div className="error">{error}</div>}
            <div className="admin-packages-table-container">
                <table className="admin-packages-table">
                    <thead>
                        <tr>
                            <th>Blog Image</th>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Blog Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="loading">Loading...</td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">No Blogs Available</td>
                            </tr>
                        ) : (
                            blogs.map(blog => (
                                <tr key={blog._id}>
                                    <td data-label="Image">
                                        <img
                                            src={`/uploads/${blog.images[0].name}`}
                                            alt={blog.title}
                                            className="package-image"
                                        />
                                    </td>
                                    <td data-label="ID">{blog._id}</td>
                                    <td data-label="Title">{blog.title}</td>
                                    <td data-label="Description">{blog.description}</td>
                                    <td data-label="Category">{blog.category?.name || "N/A"}</td>
                                    <td data-label="Actions">
                                        <span className="actions">
                                            <FaEye className="action-icon view" title="View" onClick={() => handlePreview(blog._id)} />
                                            <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(blog._id)} />
                                            <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => openDeleteModal(blog._id)} />
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
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
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

export default BlogPage;
