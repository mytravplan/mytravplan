// /app/(admin)/_common/Breadcrumb.jsx
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Breadcrumb = ({ path }) => {
  const router = useRouter();
  const segments = path.split('/').filter(segment => segment);

  const handleBreadcrumbClick = (index) => {
    let newPath;
    if (segments[index] === 'admin') {
      newPath = '/admin/dashboard';
    } else {
      newPath = '/' + segments.slice(0, index + 1).join('/');
    }
    router.push(newPath);
  };

  return (
    <div className="breadcrumb">
      <FaHome onClick={() => router.push('/')} />
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          <span> / </span>
          <span className="breadcrumb-segment" onClick={() => handleBreadcrumbClick(index)}>
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
