

'use client';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/(admin)/_common/modal/modal';
import { handelAsyncErrors } from '@/helpers/asyncErrors';
import Breadcrumb from '@/app/(admin)/_common/Breadcrumb';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';
import { formatDate } from '@/helpers/formatDateTime';



function TransferPage() {
    const [transfer, setTransfer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [itemsPerPage] = useState(PER_PAGE_LIMIT);
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    async function fetchTransfers() {
        return handelAsyncErrors(async () => {
            const response = await fetch(`/api/v1/transfer/get?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json()
            if (data) {
                setTransfer(data.results);
                setTotalResults(data.totalResults);
            }
            setLoading(false);
        })
    }
 
    useEffect(() => {
        fetchTransfers();
    }, [currentPage, itemsPerPage]);

    const handleAddClick = () => {
        router.push('/admin/transfer/add-transfer');
    };

    const openDeleteModal = (id) => {
        setIsOpen(true);
        setDeleteItem(id);
    };

    const confirmDelete = async () => {
        return handelAsyncErrors(async () => {
            const response = await fetch(`/api/v1/transfer/delete/${deleteItem}`, { method: 'DELETE' });
            const data = await response.json();
            console.log(`data`)
            console.log(data)
            if (data) {
                fetchTransfers();
                toast.success(data?.message||'Transfer deleted successfully');
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
        router.push(`/admin/transfer/update-transfer/${id}`);
    };

    const handlePreview = (id) => {
        router.push(`/admin/transfer/preview-transfer/${id}`);
    };

    console.log(`transfer`)
    console.log(transfer)

    return (
        <div className="admin-packages">
            <ModalWrapper
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={confirmDelete}
            />
            <div className="package_header">
                <Breadcrumb path="/admin/transfer" />
                <div className="floating-plus" onClick={handleAddClick}>
                    <FaPlus />
                    <div className="add_tooltip">Add</div>
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
                            <th>Price</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="loading">Loading...</td>
                            </tr>
                        ) : transfer.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">No results Available</td>
                            </tr>
                        ) : (
                            transfer.map(ele => (
                                <tr key={ele._id}>
                                    <td data-label="Image">
                                        <img
                                            src={ele?.transfer_image}
                                            alt={ele.title}
                                            className="package-image"
                                        />
                                    </td>
                                    <td data-label="ID">{ele._id}</td>
                                    <td data-label="Title">{ele.transfer_title}</td>
                                    <td data-label="Description">₹{ele.transfer_price}</td>
                                    <td data-label="Title">{formatDate(ele.createdAt)}</td>

                                    <td data-label="Actions">
                                        <span className="actions">
                                            <FaEye className="action-icon view" title="View" onClick={() => handlePreview(ele._id)} />
                                            <FaEdit className="action-icon edit" title="Edit" onClick={() => handleEdit(ele._id)} />
                                            <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => openDeleteModal(ele._id)} />
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

export default TransferPage;
