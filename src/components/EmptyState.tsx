import React from 'react';
import { Compass } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-64">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <Compass className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;