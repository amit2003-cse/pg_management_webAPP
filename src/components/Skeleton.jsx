import React from 'react';

const Skeleton = ({ width, height, borderRadius = 'var(--radius)' }) => {
  return (
    <div 
      className="skeleton-loader" 
      style={{ 
        width: width || '100%', 
        height: height || '20px',
        borderRadius: borderRadius
      }}
    />
  );
};

export default Skeleton;
