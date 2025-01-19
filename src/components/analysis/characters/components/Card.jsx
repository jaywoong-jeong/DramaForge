import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="px-4 py-3 border-b border-gray-100">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800">
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

export default Card; 