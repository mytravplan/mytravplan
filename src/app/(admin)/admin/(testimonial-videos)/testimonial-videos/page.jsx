'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [itemsPerPage] = useState(PER_PAGE_LIMIT);
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);



    console.log(videos)

    async function fetchVideos() {
        setLoading(true); // Set loading to true when fetching videos
        try {
            const response = await fetch(`/api/v1/videos/get?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json();
            if (data.success) {
                setVideos(data.result);
                setTotalResults(data.totalResults);
            } else {
                toast.error(data.message || 'Failed to fetch videos.');
            }
        } catch (error) {
            toast.error('Error fetching videos.');
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }

    useEffect(() => {
        fetchVideos();
    }, [currentPage]);

    const handleAddClick = () => {
        router.push('/admin/testimonial-videos/add-video'); // Adjust this path as necessary
    };

    const handleConfirm = async () => {
        if (!deleteItem) return; // Check if there's an item to delete
        try {
            const response = await fetch(`/api/v1/video/delete/${deleteItem}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message || 'Document deleted successfully.');
                fetchVideos(); // Refetch videos after deletion
                setIsOpen(false);
            } else {
                toast.error(data.message || 'Failed to delete video.');
            }
        } catch (error) {
            toast.error('Failed to delete video, please try again.');
        }
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

    const handleEdit = (id) => {
        router.push(`/admin/testimonial-videos/update-video/${id}`); // Adjust this path as necessary
    };

    const handlePreview = (id) => {
        router.push(`/admin/testimonial-videos/preview-video/${id}`); // Adjust this path as necessary
    };

    return (
        <div className="admin-videos">
            <ModalWrapper
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
            />
            <div className="videos_header">
                <Breadcrumb path="/admin/videos" />
                <div className="floating-plus" onClick={handleAddClick}>
                    <FaPlus />
                    <div className="add_tooltip">Add Video</div>
                </div>
            </div>
            <div className="admin-videos-table-container">
                <table className="admin-videos-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Video</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="loading">Loading...</td>
                            </tr>
                        ) : videos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">No Videos Available</td>
                            </tr>
                        ) : (
                            videos.map(video => (
                                <tr key={video._id}>
                                    <td data-label="ID">{video._id}</td>
                                    <td data-label="Name">{video.name}</td>
                                    <td data-label="Description">{video.description}</td>
                                    <td data-label="Video">
                                        <video width="320" height="240" controls>
                                            <source src={`${video.videoUrl}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </td>
                                    <td data-label="Actions">
                                        <span className="actions">
                                            <FaEye className="action-icon view" title="View" onClick={() => handlePreview(video._id)} />
                                            <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(video._id)} />
                                            <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => handleDelete(video._id)} />
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

export default Videos;
