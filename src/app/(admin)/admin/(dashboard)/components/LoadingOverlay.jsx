// components/LoadingOverlay.jsx
import React from 'react';
import './LoadingOverlay.css'; // Create a CSS file for styling

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

export default LoadingOverlay;
