// components/Modal.js
'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Modal = ({ onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(); 
    } catch (error) {
      toast.error('Error during confirmation:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>Are you sure you want to delete this item?</p>
        <div className="modal-actions">
          <button
            onClick={handleConfirm}
            className="btn-confirm"
            disabled={isLoading}
            type="button"
          >
            {isLoading ? 'deleting...' : 'Yes'}
          </button>
          <button onClick={onClose} className="btn-cancel">No</button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal {
          max-width: 400px;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          text-align: center;
        }
        .modal p {
          margin-bottom: 20px;
          font-size: 16px;
          color: #333;
        }
        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .btn-confirm {
          background-color: #CF0C2A;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .btn-confirm:hover {
          background-color: #d10b25;
        }
        .btn-cancel {
          background-color: #f0f0f0;
          color: #333;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .btn-cancel:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default Modal;
