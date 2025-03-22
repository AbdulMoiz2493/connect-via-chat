import React from 'react';

const Avatar = ({ 
  src, 
  alt = "User avatar", 
  size = "md", 
  status = null,
  showStatusRing = false
}) => {
  // Enhanced size mappings with more options
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  // Status indicator mappings with improved colors
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400"
  };

  // Status ring classes
  const statusRingClasses = status && showStatusRing ? {
    online: "ring-2 ring-green-300",
    away: "ring-2 ring-yellow-300",
    busy: "ring-2 ring-red-300",
    offline: "ring-2 ring-gray-300"
  }[status] : "";

  return (
    <div className="relative flex-shrink-0">
      <img
        src={src || `https://ui-avatars.com/api/?name=${alt}&background=random`}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm transition-transform duration-200 hover:scale-105 ${statusRingClasses}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${alt}&background=random`;
        }}
      />
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${statusColors[status]} ${
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;