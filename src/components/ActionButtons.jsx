import React from 'react';
import { FaEye, FaEdit } from 'react-icons/fa';

const ActionButtons = ({ 
  onView, 
  onEdit, 
  item,
  disabled = false
}) => {
  console.log('ActionButtons rendered with disabled:', disabled);
  
  return (
    <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
      <button
        className={`modern-action-btn modern-action-btn-view ${disabled ? 'disabled' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('View button clicked');
          onView(item);
        }}
        title="View Details"
        disabled={disabled}
      >
        <FaEye style={{ color: 'white', fontSize: '16px' }} />
      </button>
      <button
        className={`modern-action-btn modern-action-btn-edit ${disabled ? 'disabled' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Edit button clicked');
          onEdit(item);
        }}
        title="Edit"
        disabled={disabled}
      >
        <FaEdit style={{ color: 'white', fontSize: '16px' }} />
      </button>
    </div>
  );
};

export default ActionButtons; 